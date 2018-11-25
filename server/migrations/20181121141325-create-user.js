'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => {
        return queryInterface.createTable('Users', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()')
          },
          firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              notEmpty: {
                msg: 'The firstName field cannot be empty',
              },
            },
          },
          lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              notEmpty: {
                msg: 'The lastName field cannot be empty',
              },
            },
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
              isEmail: {
                msg: 'Invalid email address',
              },
            },
          },
          phoneNumber: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
              notEmpty: {
                msg: 'The Phone number field cannot be empty',
              },
            }
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              len: [8, undefined]
            },
          },
          registered: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
          },
          role: {
            type: Sequelize.STRING,
            references: {
              model: 'Roles',
              key: 'name',
              as: 'role'
            },
            defaultValue: 'Reporter'
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
          }
      });
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};