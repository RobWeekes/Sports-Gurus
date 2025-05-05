"use strict";

// const bcrypt = require("bcryptjs");

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
        prediction_type: "point spread",
        prediction: "Philadelphia covers spread",
        result: "TBD"
      },
      {
        user_id: 1,
        page_id: 2,
        game_id: 2,
        prediction_type: "over/under",
        prediction: "total points: over",
        result: "TBD"
      },
      {
        user_id: 2,
        page_id: 3,
        game_id: 3,
        prediction_type: "point spread",
        prediction: "Detroit covers spread",
        result: "TBD"
      },
      {
        user_id: 1,
        page_id: 4,
        game_id: 4,
        prediction_type: "over/under",
        prediction: "total points: under",
        result: "TBD"
      },
      {
        user_id: 1,
        page_id: 5,
        game_id: 5,
        prediction_type: "point spread",
        prediction: "Atlanta covers spread",
        result: "TBD"
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "userpicks";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }, {});
  }
};
