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
        league: "NBA",
        gameDay: new Date("2025-05-06"),
        homeTeam: "LOS ANGELES LAKERS",
        awayTeam: "LA CLIPPERS",
        favorite: "LOS ANGELES LAKERS",
        underdog: "LA CLIPPERS",
        status: "FINAL",
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
        league: "NFL",
        gameDay: new Date("2025-09-10"),
        homeTeam: "KANSAS CITY CHIEFS",
        awayTeam: "BUFFALO BILLS",
        favorite: "KANSAS CITY CHIEFS",
        underdog: "BUFFALO BILLS",
        status: "FINAL",
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
        league: "NBA",
        gameDay: new Date("2025-10-22"),
        homeTeam: "ATLANTA HAWKS",
        awayTeam: "BOSTON CELTICS",
        favorite: "BOSTON CELTICS",
        underdog: "ATLANTA HAWKS",
        status: "FINAL",
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
        league: "MLB",
        gameDay: new Date("2025-04-01"),
        homeTeam: "NEW YORK YANKEES",
        awayTeam: "BOSTON RED SOX",
        favorite: "NEW YORK YANKEES",
        underdog: "BOSTON RED SOX",
        status: "FINAL",
        favoriteScore: 5,
        underdogScore: 3,
        totalScore: 8,
        totalLine: 7.5,
        overUnder: "OVER",
        pointSpread: -2.5,
        coversSpread: "UNDERDOG"
      },
      {
        game_id: 5,
        league: "NHL",
        gameDay: new Date("2025-04-10"),
        homeTeam: "TORONTO MAPLE LEAFS",
        awayTeam: "DETROIT RED WINGS",
        favorite: "DETROIT RED WINGS",
        underdog: "TORONTO MAPLE LEAFS",
        status: "",
        favoriteScore: 0,
        underdogScore: 0,
        totalScore: 0,
        totalLine: 3.5,
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
