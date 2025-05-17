"use strict";

const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  class ScheduledGame extends Model {
    static associate(models) {

      // ScheduledGame has many UserPicks
      ScheduledGame.hasMany(models.UserPick, {
        foreignKey: "game_id",
        onDelete: "CASCADE"
      });

      // ScheduledGame has one GameResult
      ScheduledGame.hasOne(models.GameResult, {
        foreignKey: "game_id",
        onDelete: "CASCADE"
      });
    }
  }

  ScheduledGame.init({
    league: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        len: [3, 6]
      }
    },
    gameDay: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    homeTeam: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [3, 30]
      }
    },
    awayTeam: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [3, 30]
      }
    }
  }, {
    sequelize,
    modelName: "ScheduledGame",
    tableName: "scheduledgames",
  });

  return ScheduledGame;
};
