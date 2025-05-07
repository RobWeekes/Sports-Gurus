"use strict";

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("scheduledgames", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      league: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      gameDay: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      homeTeam: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      awayTeam: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "scheduledgames";
    return queryInterface.dropTable(options);
  }
};
