"use strict";

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "userpicks";
    return queryInterface.bulkInsert(options, [
      {
        user_id: 1,
        page_id: 1,
        game_id: 1,
        predictionType: "POINT SPREAD",
        prediction: "LOS ANGELES COVERS SPREAD",
        result: "TBD"
      },
      {
        user_id: 1,
        page_id: 2,
        game_id: 2,
        predictionType: "POINT SPREAD",
        prediction: "KANSAS CITY COVERS SPREAD",
        result: "TBD"
      },
      {
        user_id: 1,
        page_id: 1,
        game_id: 3,
        predictionType: "POINT SPREAD",
        prediction: "BOSTON COVERS SPREAD",
        result: "TBD"
      },
      {
        user_id: 1,
        page_id: 3,
        game_id: 4,
        predictionType: "OVER / UNDER",
        prediction: "TOTAL RUNS OVER",
        result: "TBD"
      },
      {
        user_id: 2,
        page_id: 4,
        game_id: 2,
        predictionType: "POINT SPREAD",
        prediction: "BUFFALO COVERS SPREAD",
        result: "TBD"
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "userpicks";
    return queryInterface.bulkDelete(options, {}, {});
  }
};
