'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Presenter = sequelize.define(
    'Presenter',
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      role: DataTypes.STRING,
      bio: DataTypes.STRING
    },
    {
      paranoid: true
    }
  );

  Presenter.associate = function(models) {
    Presenter.belongsToMany(models.Event, {
      through: 'EventPresenter',
      as: 'events',
      foreignKey: 'presenter_id',
      otherKey: 'event_id'
    });
  };
  return Presenter;
};
