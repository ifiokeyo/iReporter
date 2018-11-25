'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(() => {
      return queryInterface.createTable('Incidents', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()')
        },
        type: {
          type: Sequelize.STRING,
          references: {
            model: 'IncidentTypes',
            key: 'name',
            as: 'type',
          },
        },
        location: {
          type: Sequelize.GEOMETRY('POINT'),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'The location field cannot be empty',
            }
          },
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'pending'
        },
        images: {
          type: Sequelize.ARRAY(Sequelize.TEXT)
        },
        videos: {
          type: Sequelize.ARRAY(Sequelize.TEXT)
        },
        comment: {
          type: Sequelize.TEXT
        },
        createdBy: {
          type: Sequelize.UUID,
          references: {
            model: 'Users',
            key: 'id',
            as: 'createdBy',
          },
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
    return queryInterface.dropTable('Incidents');
  }
};