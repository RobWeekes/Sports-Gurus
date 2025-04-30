'use strict';

// const { Op } = require('sequelize');
// const { User } = require('../models');
const bcrypt = require('bcryptjs');

// define your schema in options object
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        firstName: 'Dude',
        lastName: 'Bro',
        email: 'demo@user.io',
        userName: 'Demolition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Dude2',
        lastName: 'Bro2',
        email: 'user1@user.io',
        userName: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Dude3',
        lastName: 'Bro3',
        email: 'user2@user.io',
        userName: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      email: { [Op.in]: ['demo@user.io', 'user1@user.io', 'user2@user.io'] }
    }, {});
  }
};
