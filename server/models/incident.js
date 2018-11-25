'use strict';
module.exports = (sequelize, DataTypes) => {
  const Incident = sequelize.define('Incident', {
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The location field cannot be empty',
        }
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    images: DataTypes.ARRAY(DataTypes.TEXT),
    videos: DataTypes.ARRAY(DataTypes.TEXT),
    comment: DataTypes.TEXT
  });
  Incident.associate = (models) => {
    // associations can be defined here
  };
  return Incident;
};