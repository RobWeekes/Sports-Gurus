'use strict';

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "userpickpages";
    return queryInterface.bulkInsert(options, [
      {
        user_id: 1,
        pagename: "Rob's Basketball Picks",
        game_id: 1,
        prediction_type: "point spread",
        prediction: "Philadelphia covers spread",
        result: "",
      },
      {
        user_id: 1,
        pagename: "Rob's Basketball Picks",
        game_id: 2,
        prediction_type: "over/under",
        prediction: "total points: over",
        result: "",
      },
      {
        user_id: 2,
        pagename: "Dustin's NFL Picks",
        game_id: 3,
        prediction_type: "point spread",
        prediction: "Detroit covers spread",
        result: "",
      },
      {
        user_id: 1,
        pagename: "Rob's Basketball Picks",
        game_id: 4,
        prediction_type: "over/under",
        prediction: "total points: under",
        result: "",
      },
      {
        user_id: 1,
        pagename: "Rob's Baseball Page",
        game_id: 5,
        prediction_type: "point spread",
        prediction: "Atlanta covers spread",
        result: "",
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "userpickpages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});

  }
};
