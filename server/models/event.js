'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    'Event',
    {
      name: DataTypes.STRING
    },
    {
      paranoid: true
    }
  );

  Event.associate = function(models) {
    Event.belongsToMany(models.Presenter, {
      through: 'EventPresenter',
      as: 'presenters',
      foreignKey: 'event_id',
      otherKey: 'presenter_id'
    });
  };

  return Event;
};
