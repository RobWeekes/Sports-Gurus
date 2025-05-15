"use strict";

const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {

      // define associations here
      UserProfile.belongsTo(models.User, {
        foreignKey: "user_id"
      });
    }
  }
  UserProfile.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    aboutMe: {
      type: DataTypes.STRING(300),
      defaultValue: "Sport Nut",
      validate: {
        len: [0, 300]
      }
    },
    sportIcon: {
      type: DataTypes.STRING(12),
      allowNull: false,
      validate: {
        len: [0, 12]
      }
    }
  }, {
    sequelize,
    modelName: 'UserProfile',
    tableName: "userprofiles",
  });

  return UserProfile;
};
