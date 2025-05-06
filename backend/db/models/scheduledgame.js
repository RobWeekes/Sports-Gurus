'use strict';

const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class ScheduledGame extends Model {
    static associate(models) {

      // ScheduledGame has one UserPick
      ScheduledGame.hasOne(models.UserPick, {
        foreignKey: 'game_id'
      });

      // // ScheduledGame has one GameResult
      // ScheduledGame.hasOne(models.GameResult, {
      //   foreignKey: 'game_id'
      // });
    }
  }

  ScheduledGame.init({
    league: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        len: [1, 40]
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
        len: [1, 30]
      }
    },
    awayTeam: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [1, 30]
      }
    }
  }, {
    sequelize,
    modelName: 'ScheduledGame',
    tableName: "scheduledgames",
  });

  return ScheduledGame;
};
