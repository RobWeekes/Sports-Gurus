'use strict';

const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class UserPickPage extends Model {
    static associate(models) {
      // UserPickPage belongs to a User
      UserPickPage.belongsTo(models.User, {
        foreignKey: 'user_id'
      });

      // UserPickPage has many UserPicks
      UserPickPage.hasMany(models.UserPick, {
        foreignKey: 'page_id'
      });
    }
  }

  UserPickPage.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pagename: {
      type: DataTypes.STRING(40),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'UserPickPage',
    tableName: "userpickpages",
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'pagename'],
        name: 'unique_user_pagename'
      }
    ]
  });
  return UserPickPage;
};
