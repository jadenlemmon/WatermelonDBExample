'use strict';
const uuid = require('uuid/v4');
const faker = require('faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const events = Array.from(Array(2).keys()).map(function() {
      return {
        id: uuid(),
        name: faker.name.title(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await queryInterface.bulkInsert('Events', events, {});

    const [insertedEvents] = await queryInterface.sequelize.query(
      `SELECT id from Events;`
    );

    const wait = insertedEvents.map(async event => {
      const presenters = Array.from(Array(10).keys()).map(function() {
        return {
          id: uuid(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          role: faker.name.title(),
          bio: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });

      const relationIds = presenters.map(pres => ({
        id: uuid(),
        presenter_id: pres.id,
        event_id: event.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      return await Promise.all([
        await queryInterface.bulkInsert('Presenters', presenters, {}),
        await queryInterface.bulkInsert('EventPresenters', relationIds, {})
      ]);
    });

    return await Promise.all(wait);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
