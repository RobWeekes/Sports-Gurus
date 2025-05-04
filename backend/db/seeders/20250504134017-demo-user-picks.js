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
    options.tableName = 'userpicks';
    return queryInterface.bulkInsert(options, [
      {
        user_id: 1,
        pagename: 'Basketball Picks',
        sport_league: 'NBA',
        predicted_winning_team: 'Golden State Warriors',
        predicted_losing_team: 'San Antonio Spurs',
        win_type: 'Cover spread',
      },
      {
        user_id: 2,
        pagename: 'Basketball Picks',
        sport_league: 'NBA',
        predicted_winning_team: 'Los Angeles Lakers',
        predicted_losing_team: 'San Antonio Spurs',
        win_type: 'Cover spread',
      },
      {
        user_id: 3,
        pagename: 'Basketball Picks',
        sport_league: 'NBA',
        predicted_winning_team: 'LA Clippers',
        predicted_losing_team: 'Dallas Mavericks',
        win_type: 'Win',
      },
      {
        user_id: 4,
        pagename: 'Basketball Picks',
        sport_league: 'NBA',
        predicted_winning_team: 'Denver Nuggets',
        predicted_losing_team: 'Boston Celtics',
        win_type: 'Over',
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'userpicks';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
