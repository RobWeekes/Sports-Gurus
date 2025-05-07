"use strict";

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "gameresults";
    return queryInterface.bulkInsert(options, [
      {
        game_id: 1,
        favorite: "LOS ANGELES LAKERS",
        underdog: "LA CLIPPERS",
        status: "COMPLETED",
        favoriteScore: 110,
        underdogScore: 100,
        totalScore: 210,
        totalLine: 215.5,
        overUnder: "UNDER",
        pointSpread: -10.5,
        coversSpread: "UNDERDOG"
      },
      {
        game_id: 2,
        favorite: "KANSAS CITY CHIEFS",
        underdog: "BUFFALO BILLS",
        status: "COMPLETED",
        favoriteScore: 27,
        underdogScore: 20,
        totalScore: 47,
        totalLine: 45.5,
        overUnder: "OVER",
        pointSpread: -6.5,
        coversSpread: "FAVORITE"
      },
      {
        game_id: 3,
        favorite: "BOSTON CELTICS",
        underdog: "ATLANTA HAWKS",
        status: "COMPLETED",
        favoriteScore: 111,
        underdogScore: 102,
        totalScore: 213,
        totalLine: 210.5,
        overUnder: "OVER",
        pointSpread: -8.5,
        coversSpread: "FAVORITE"
      },
      {
        game_id: 4,
        favorite: "NEW YORK YANKEES",
        underdog: "BOSTON RED SOX",
        status: "COMPLETED",
        favoriteScore: 5,
        underdogScore: 3,
        totalScore: 8,
        totalLine: 7.5,
        overUnder: "OVER",
        pointSpread: -2.5,
        coversSpread: "UNDERDOG"
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "gameresults";
    return queryInterface.bulkDelete(options, {}, {});
  }
};
