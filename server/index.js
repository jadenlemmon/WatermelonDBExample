const express = require('express');
const bodyParser = require('body-parser');
const { Presenter } = require('./models');
const { Sequelize } = require('sequelize');
const { sequelize } = require('./models');
const moment = require('moment');

const Op = Sequelize.Op;

const app = express();
const port = 7000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/sync', async (req, res) => {
  let lastPulledAt = req.query.last_pulled_at;

  if (lastPulledAt === 'null') {
    lastPulledAt = false;
  } else {
    lastPulledAt = moment.unix(lastPulledAt);
  }

  // if no last_pulled_at is provided, then they haven't pulled anything yet
  // it's a first time sync so send all resources
  const presentersCreated = await Presenter.findAll({
    ...(!!lastPulledAt && {
      where: {
        createdAt: {
          [Op.gt]: lastPulledAt
        }
      }
    })
  });

  const createdIds = presentersCreated.map(p => p.id);

  let presentersUpdated = lastPulledAt
    ? await Presenter.findAll({
        where: {
          id: { [Op.notIn]: createdIds },
          updatedAt: {
            [Op.gt]: lastPulledAt
          }
        }
      })
    : [];

  const presentersDeleted = lastPulledAt
    ? await Presenter.findAll({
        where: {
          deletedAt: {
            [Op.gt]: lastPulledAt
          }
        }
      })
    : [];

  return res.json({
    changes: {
      presenters: {
        created: presentersCreated,
        updated: presentersUpdated,
        deleted: presentersDeleted
      }
    },
    timestamp: moment().unix()
  });
});

app.post('/sync', async (req, res) => {
  if (req.body && req.body.presenters) {
    const { created, updated, deleted } = req.body.presenters;

    // All DB updates should be wrapped into a transaction and revert if anything goes south
    const tx = await sequelize.transaction();

    const createUpdates = created.map(pres =>
      Presenter.create(pres, { transaction: tx })
    );

    const updateUpdates = updated.map(pres =>
      Presenter.update(pres, { where: { id: pres.id }, transaction: tx })
    );

    const deletedUpdates = deleted.map(pres =>
      Presenter.destroy({ where: { id: pres.id }, transaction: tx })
    );

    try {
      // roll up all updates and wait on the promises to execute
      await Promise.all([
        ...createUpdates,
        ...updateUpdates,
        ...deletedUpdates
      ]);
      await tx.commit();
    } catch (error) {
      console.log(error);
      await tx.rollback();
    }
  }

  return res.send();
});

app.listen(port, () => console.log(`Watermelon API running on port ${port}!`));
