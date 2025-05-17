"use strict";

// define the schema name for Postgres production database in options object
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
      },
      userName: {
        type: Sequelize.STRING(30),
        unique: true,
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }
    }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "users";
    return queryInterface.dropTable(options);
  }
};
