'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Presenter = sequelize.define(
    'Presenter',
    {
      // id: DataTypes.UUID,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      role: DataTypes.STRING,
      bio: DataTypes.STRING
    },
    {
      paranoid: true
    }
  );

  // Presenter.beforeCreate(presenter => (presenter.id = uuid()));

  Presenter.associate = function(models) {
    // associations can be defined here
  };
  return Presenter;
};
