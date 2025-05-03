"use strict";

// import { Sequelize, DataTypes } from "sequelize";
const { Model, Validator } = require("sequelize");


// helper function for name validation
function validateNameCharacters (value) {
  const charCounts = { '-': 0, '.': 0, "'": 0, ' ': 0 };
  const limits = { '-': 2, '.': 2, "'": 1, ' ': 2 };
  const errorMessages = {
    '-': "Limit 2 hyphens.",
    '.': "Limit 2 periods.",
    "'": "Limit 1 apostrophe.",
    ' ': "Limit 2 spaces."
  };

  for (const char of value) {
    if (charCounts[char] !== undefined) {
      charCounts[char]++;
      if (charCounts[char] > limits[char]) {
        throw new Error(errorMessages[char]);
      }
    } else if (!/[a-zA-Z]/.test(char)) {
      throw new Error("Must use alpha characters (- . ' and spaces allowed)");
    }
  }
};

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
        len: [2, 40],
        isAllowedSpecialChars(value) {
          validateNameCharacters(value);
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 40],
        isAllowedSpecialChars(value) {
          validateNameCharacters(value);
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
            throw new Error("Cannot be an email.");
          }
        },
        hasNoSpaces(value) {
          for (const char of value) {
            if (char === ' ') throw new Error('Special characters allowed, except no spaces.');
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
    modelName: "User",
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
    // scopes: {
    //   withAllFields: {
    //     attributes: {
    //       exclude: ["hashedPassword"]
    //     }
    //   }
    // }
  });
  return User;
};
