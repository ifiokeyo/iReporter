'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
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
  Role.associate = (models) => {
    Role.hasOne(models.User, {
      foreignKey: 'role',
      targetKey: 'name'
    });
  };
  return Role;
};