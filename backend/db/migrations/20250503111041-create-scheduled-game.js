'use strict';

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scheduledgames', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      league: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gameDay: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      homeTeam: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      awayTeam: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'scheduledgames';
    return queryInterface.dropTable(options);
  }
};
