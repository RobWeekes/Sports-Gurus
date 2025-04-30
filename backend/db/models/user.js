'use strict';

// import { Sequelize, DataTypes } from 'sequelize';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 30],
        isAlpha: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 40],
        isAlphaHyphen(value) {
          let hyphen = 0;
          for (const char of value) {
            if (char === '-') hyphen++;
            if (hyphen > 2) throw new Error('Limit 2 hyphens.')
            if (!/[a-zA-Z]/.test(char) && char !== '-') {
              throw new Error('Must use alpha characters. Hyphens allowed.')
            }
          };
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [8, 40],
      }
    },
    userName: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Cannot be an email.');
          }
        }
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60],
      },
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
