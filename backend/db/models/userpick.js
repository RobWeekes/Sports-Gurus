"use strict";

const { Model, Validator } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  class UserPick extends Model {
    static associate(models) {
      // UserPick belongs to a User
      UserPick.belongsTo(models.User, {
        foreignKey: 'user_id'
      });

      // // UserPick belongs to a ScheduledGame
      // UserPick.belongsTo(models.ScheduledGame, {
      //   foreignKey: 'game_id'
      // });

      // // UserPick has many Subscriptions through pagename
      // UserPick.hasMany(models.Subscription, {
      //   foreignKey: 'user_picks_pagename',
      //   sourceKey: 'pagename',
      //   constraints: false
      // });

      // // UserPick has many Comments through pagename
      // UserPick.hasMany(models.Comment, {
      //   foreignKey: 'user_picks_pagename',
      //   sourceKey: 'pagename',
      //   constraints: false
      // });

      // // UserPick has many Posts through pagename
      // UserPick.hasMany(models.Post, {
      //   foreignKey: 'user_picks_pagename',
      //   sourceKey: 'pagename',
      //   constraints: false
      // });
    }
  }
  UserPick.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pagename: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prediction_type: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    prediction: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    result: {
      type: DataTypes.STRING(4),
      defaultValue: 'TBD',
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'UserPick',
    tableName: "userpicks",
  });
  return UserPick;
};
