'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Countries'
          },
          key: 'id'
        }
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Cities'
          },
          key: 'id'
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      project_manager: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contact_person: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      contact_phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contact_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      num_volunteers: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      deadline: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      conditions: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      execution_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Execution_type'
          },
          key: 'id'
        }
      },
      available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Projects');
  }
};