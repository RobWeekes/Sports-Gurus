'use strict';

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userpicks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      page_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'userpickpages',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'scheduledgames',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      predictionType: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      prediction: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      result: {
        type: Sequelize.STRING(4),
        allowNull: false,
        defaultValue: 'TBD',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'userpicks';
    return queryInterface.dropTable(options);
  }
};
