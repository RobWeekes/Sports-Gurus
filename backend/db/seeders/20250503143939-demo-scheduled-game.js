"use strict";

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "scheduledgames";
    return queryInterface.bulkInsert(options, [
      {
        league: "NBA",
        gameDay: new Date('2025-05-06'),
        homeTeam: "Los Angeles Lakers",
        awayTeam: "LA Clippers",
      },
      {
        league: 'NFL',
        gameDay: new Date('2025-09-10'),
        homeTeam: 'Kansas City Chiefs',
        awayTeam: 'Buffalo Bills',
      },
      {
        league: 'NBA',
        gameDay: new Date('2025-10-22'),
        homeTeam: 'Atlanta Hawks',
        awayTeam: 'Boston Celtics',
      },
      {
        league: 'MLB',
        gameDay: new Date('2025-04-01'),
        homeTeam: 'New York Yankees',
        awayTeam: 'Boston Red Sox',
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "scheduledgames";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
    }, {});
  }
};
