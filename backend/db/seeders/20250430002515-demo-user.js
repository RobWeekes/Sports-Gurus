'use strict';

const bcrypt = require('bcryptjs');

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: "Rob",
        lastName: "Weekes",
        email: "demo@user.io",
        userName: "Demo-lition",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        firstName: "Dustin",
        lastName: "Guy",
        email: "user2@user.io",
        userName: "FakeUser1",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        firstName: "Michael",
        lastName: "Porter Jr.",
        email: "user3@user.io",
        // userName: "FakeUser2",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        firstName: "Peter",
        lastName: "Parker",
        email: "spidey@spider.man",
        userName: "Spidey",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        firstName: "Peter",
        lastName: "Parker-Griffin-Dude",
        email: "spidey2@spider.man",
        userName: "FamilyGuy-Spiderman",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        firstName: "Shai",
        lastName: "Gilgeous-Alexander",
        email: "mvp@aol.com",
        userName: "BallisLife-MVP",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        firstName: "Conan",
        lastName: "O'Brien",
        email: "funnyguy@gmail.com",
        userName: "Make-Us-Laugh!",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        firstName: "Rob",
        lastName: "O'Malley O'Brian",
        email: "user8@user.io",
        userName: "Robdude85",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        firstName: "Robert Louis",
        lastName: "Stevenson",
        email: "user9@user.io",
        userName: "AuthorGuy",
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        firstName: "Robert",
        lastName: "Louis Stevenson Rules",
        email: "user10@user.io",
        userName: "AuthorGuy2",
        hashedPassword: bcrypt.hashSync("password")
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'users';
    return queryInterface.bulkDelete(options, {}, {});
  }
};
