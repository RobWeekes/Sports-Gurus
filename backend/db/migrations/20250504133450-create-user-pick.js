'use strict';

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userpicks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pagename: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      prediction_type: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      prediction: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      result: {
        type: Sequelize.STRING(4),
        defaultValue: Sequelize.literal('TBD'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      }
    }, options);

    // Add unique constraint for user_id and pagename combination
    await queryInterface.addConstraint('userpicks', {
      fields: ['user_id', 'pagename'],
      type: 'unique',
      name: 'unique_user_pagename'
    }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'userpicks';
    // Remove the constraint first
    await queryInterface.removeConstraint('userpicks', 'unique_user_pagename', options);
    // Then drop the table
    return queryInterface.dropTable(options);
  }
};
