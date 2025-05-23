"use strict";

const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserPick extends Model {
    static associate(models) {

      // UserPick belongs to a User
      UserPick.belongsTo(models.User, {
        foreignKey: "user_id"
      });

      // UserPick belongs to a UserPickPage
      UserPick.belongsTo(models.UserPickPage, {
        foreignKey: "page_id"
      });

      // UserPick belongs to a ScheduledGame
      UserPick.belongsTo(models.ScheduledGame, {
        foreignKey: "game_id"
      });
    }
  }
  UserPick.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    page_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    predictionType: {
      type: DataTypes.STRING(12),
      allowNull: false,
      validate: {
        isIn: [["POINT SPREAD", "OVER / UNDER", "spread", "total", "winner"]]
      }
    },
    prediction: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [3, 30]
      }
    },
    result: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: "TBD",
      validate: {
        isIn: [["TBD", "WIN", "LOSS", "CANCELED"]]
      }
    }
  }, {
    sequelize,
    modelName: "UserPick",
    tableName: "userpicks",
  });

  return UserPick;
};
