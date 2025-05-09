"use strict";

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "userpickpages";
    return queryInterface.bulkInsert(options, [
      {
        user_id: 1,
        pageName: "Rob's Basketball Picks",
      },
      {
        user_id: 1,
        pageName: "Rob's Football Dojo",
      },
      {
        user_id: 1,
        pageName: "Rob's Baseball Page",
      },
      {
        user_id: 2,
        pageName: "Dustin's NFL Picks",
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "userpickpages";
    return queryInterface.bulkDelete(options, {}, {});
  }
};
