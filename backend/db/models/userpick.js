'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPick extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserPick.init({
    user_id: DataTypes.INTEGER,
    pagename: DataTypes.STRING,
    sport_league: DataTypes.STRING,
    predicted_winning_team: DataTypes.STRING,
    predicted_losing_team: DataTypes.STRING,
    win_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserPick',
    tableName: "userpicks",
  });
  return UserPick;
};
