"use strict";

const { Model } = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  class GameResult extends Model {
    static associate(models) {

      // GameResult has

    }
  }

  GameResult.init({
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    favorite: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "TBD",
      validate: {
        len: [3, 30]
      }
    },
    underdog: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "TBD",
      validate: {
        len: [3, 30]
      }
    },
    status: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: "TBD",
      validate: {
        isIn: [["TBD", "GAME STARTED", "COMPLETED", "CANCELED", "POSTPONED", "RESCHEDULED"]]
      }
    },
    favoriteScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    underdogScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalLine: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    overUnder: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "TBD",
      validate: {
        isIn: [["TBD", "OVER", "UNDER"]]
      }
    },
    pointSpread: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    coversSpread: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: "TBD",
      validate: {
        isIn: [["TBD", "FAVORITE", "UNDERDOG"]]
      }
    },
  }, {
    sequelize,
    modelName: "GameResult",
    tableName: "gameresults",
  });

  return GameResult;
};
