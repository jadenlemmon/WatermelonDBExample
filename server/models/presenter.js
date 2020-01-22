'use strict';
module.exports = (sequelize, DataTypes) => {
  const Presenter = sequelize.define(
    'Presenter',
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      role: DataTypes.STRING,
      bio: DataTypes.STRING
    },
    {}
  );
  Presenter.associate = function(models) {
    // associations can be defined here
  };
  return Presenter;
};
