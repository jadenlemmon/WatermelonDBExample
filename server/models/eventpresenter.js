'use strict';
module.exports = (sequelize, DataTypes) => {
  const EventPresenter = sequelize.define(
    'EventPresenter',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      event_id: DataTypes.NUMBER,
      presenter_id: DataTypes.UUID
    },
    {
      paranoid: true
    }
  );
  EventPresenter.associate = function(models) {
    // associations can be defined here
  };
  return EventPresenter;
};
