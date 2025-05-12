"use strict";

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "userprofiles";
    return queryInterface.bulkInsert(options, [
      {
        user_id: 1,
        aboutMe: "I'm a fun guy... -Kawhi Leonard",
        sportIcon: "basketball"
      },
      {
        user_id: 2,
        aboutMe:
          "I like football I like football I like football I like football I like football I like football I like football I like football I like football I like football I like football I like football I like football I like football I like football I like football I like football I like football I like footb",
        sportIcon: ""
      },
      {
        user_id: 3,
        aboutMe: "I'm a hooper.",
        sportIcon: "basketball2"
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "userprofiles";
    return queryInterface.bulkDelete(options, {}, {});
  }
};
