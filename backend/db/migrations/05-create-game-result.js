"use strict";

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("gameresults", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "scheduledgames",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      favorite: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "TBD"
      },
      underdog: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "TBD"
      },
      status: {
        type: Sequelize.STRING(12),
        allowNull: false,
        defaultValue: "TBD"
      },
      favoriteScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      underdogScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalScore: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalLine: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      overUnder: {
        type: Sequelize.STRING(5),
        allowNull: false,
        defaultValue: "TBD"
      },
      pointSpread: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      coversSpread: {
        type: Sequelize.STRING(8),
        allowNull: false,
        defaultValue: "TBD"
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
    options.tableName = "gameresults";
    return queryInterface.dropTable(options);
  }
};
