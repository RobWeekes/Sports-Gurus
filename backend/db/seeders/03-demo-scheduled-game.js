"use strict";

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "scheduledgames";
    return queryInterface.bulkInsert(options, [
      {
        league: "NBA",
        gameDay: new Date("2025-05-06"),
        homeTeam: "LOS ANGELES LAKERS",
        awayTeam: "LA CLIPPERS",
      },
      {
        league: "NFL",
        gameDay: new Date("2025-09-10"),
        homeTeam: "KANSAS CITY CHIEFS",
        awayTeam: "BUFFALO BILLS",
      },
      {
        league: "NBA",
        gameDay: new Date("2025-10-22"),
        homeTeam: "ATLANTA HAWKS",
        awayTeam: "BOSTON CELTICS",
      },
      {
        league: "MLB",
        gameDay: new Date("2025-04-01"),
        homeTeam: "NEW YORK YANKEES",
        awayTeam: "BOSTON RED SOX",
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "scheduledgames";
    return queryInterface.bulkDelete(options, {}, {});
  }
};
