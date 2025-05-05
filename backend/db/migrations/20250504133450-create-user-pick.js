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
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pagename: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      prediction_type: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      prediction: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      result: {
        type: Sequelize.STRING(4),
        defaultValue: Sequelize.literal('TBD'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'userpicks';
    return queryInterface.dropTable(options);
  }
};
