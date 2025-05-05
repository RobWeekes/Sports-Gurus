'use strict';

// define production schema in options object
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userpickpages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      pagename: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);

    // Add unique constraint - combination user_id and pagename is unique
    await queryInterface.addConstraint('userpickpages', {
      fields: ['user_id', 'pagename'],
      type: 'unique',
      name: 'unique_user_pagename'
    }, options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'userpickpages';
    // Remove the constraint first
    await queryInterface.removeConstraint('userpickpages', 'unique_user_pagename', options);
    // Then drop the table
    return queryInterface.dropTable(options);
  }
};
