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
        predictionType: "point spread",
        prediction: "Los Angeles covers spread",
        result: "TBD"
      },
      {
        user_id: 1,
        page_id: 2,
        game_id: 2,
        predictionType: "point spread",
        prediction: "Kansas City covers spread",
        result: "TBD"
      },
      {
        user_id: 1,
        page_id: 1,
        game_id: 3,
        predictionType: "point spread",
        prediction: "Boston covers spread",
        result: "TBD"
      },
      {
        user_id: 1,
        page_id: 3,
        game_id: 4,
        predictionType: "point spread",
        prediction: "New York covers spread",
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
