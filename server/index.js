const express = require('express');
const bodyParser = require('body-parser');
const { Presenter } = require('./models');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const app = express();
const port = 7000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/sync', (req, res) => {
  const lastPulledAt = req.query.last_pulled_at;

  console.log(lastPulledAt);

  Presenter.findAll({
    where: {
      createdAt: {
        [Op.gt]: lastPulledAt
      }
    }
  }).then(presenters => {
    res.json({
      changes: {
        presenters: {
          created: presenters,
          updated: [],
          deleted: []
        }
      }
    });
  });
});

app.post('/sync', (req, res) => {
  res.json({});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
