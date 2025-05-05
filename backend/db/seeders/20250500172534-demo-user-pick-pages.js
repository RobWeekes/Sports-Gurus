'use strict';

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "userpickpages";
    return queryInterface.bulkInsert(options, [
      {
        user_id: 1,
        pagename: "Rob's Basketball Picks",
      },
      {
        user_id: 1,
        pagename: "Rob's Soccer Dojo",
      },
      {
        user_id: 2,
        pagename: "Dustin's NFL Picks",
      },
      {
        user_id: 1,
        pagename: "Rob's Football Picks",
      },
      {
        user_id: 1,
        pagename: "Rob's Baseball Page",
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "userpickpages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }, {});

  }
};
