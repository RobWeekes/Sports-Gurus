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
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      pagename: {
        allowNull: false,
        type: Sequelize.STRING(40)
      },
      sport_league: {
        type: Sequelize.STRING(40)
      },
      predicted_winning_team: {
        type: Sequelize.STRING(40)
      },
      predicted_losing_team: {
        type: Sequelize.STRING(40)
      },
      win_type: {
        type: Sequelize.STRING(20)
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'userpicks';
    return queryInterface.dropTable(options);
  }
};
