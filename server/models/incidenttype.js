'use strict';
module.exports = function(sequelize, DataTypes) {
  const IncidentType = sequelize.define('IncidentType', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'name field cannot be empty',
        },
      },
    },
  });
  IncidentType.associate = (models) => {
    IncidentType.hasOne(models.Incident, {
      foreignKey: 'type',
      targetKey: 'name'
    });
  };
  return IncidentType;
};