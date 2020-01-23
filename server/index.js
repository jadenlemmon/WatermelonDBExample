const express = require('express');
const bodyParser = require('body-parser');
const { Presenter, Event, EventPresenter } = require('./models');
const { Sequelize } = require('sequelize');
const { sequelize } = require('./models');
const moment = require('moment');

const Op = Sequelize.Op;

const app = express();
const port = 7000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const syncModels = async (ModelToSync, lastPulledAt) => {
  // if no last_pulled_at is provided, then they haven't pulled anything yet
  // it's a first time sync so send all resources
  const modelsCreated = await ModelToSync.findAll({
    ...(!!lastPulledAt && {
      where: {
        createdAt: {
          [Op.gt]: lastPulledAt
        }
      }
    })
  });

  // Ensure we don't send created records in updated records
  // This confuses the client if we have duplicates
  const createdIds = modelsCreated.map(p => p.id);

  let modelsUpdated = lastPulledAt
    ? await ModelToSync.findAll({
        where: {
          id: { [Op.notIn]: createdIds },
          updatedAt: {
            [Op.gt]: lastPulledAt
          }
        }
      })
    : [];

  // Ensure we have a last_pulled_at to send deleted records
  const modelsDeleted = lastPulledAt
    ? await ModelToSync.findAll({
        where: {
          deletedAt: {
            [Op.gt]: lastPulledAt
          }
        }
      })
    : [];

  return [modelsCreated, modelsUpdated, modelsDeleted];
};

const ModelsToSync = [
  {
    model: Presenter,
    key: 'presenters'
  },
  { model: Event, key: 'events' },
  { model: EventPresenter, key: 'event_presenter' }
];

app.get('/sync', async (req, res) => {
  let lastPulledAt = req.query.last_pulled_at;

  // verify last_pulled_at and convert to a moment obj if valid
  if (!lastPulledAt || lastPulledAt === 'null') {
    lastPulledAt = false;
  } else {
    lastPulledAt = moment.unix(lastPulledAt);
  }

  let changes = {};

  const wait = ModelsToSync.map(async ({ model, key }) => {
    const [created, updated, deleted] = await syncModels(model, lastPulledAt);
    changes[key] = { created, updated, deleted };
  });

  await Promise.all(wait);

  return res.json({
    changes,
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
