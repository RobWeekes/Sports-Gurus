"use strict";

// import { Sequelize, DataTypes } from "sequelize";
const { Model, Validator } = require("sequelize");


// helper function for name validation
function validateNameCharacters(value) {
  const charCounts = { "-": 0, ".": 0, "'": 0, " ": 0 };
  const limits = { "-": 2, ".": 2, "'": 1, " ": 2 };
  const errorMessages = {
    "-": "Limit 2 hyphens.",
    ".": "Limit 2 periods.",
    "'": "Limit 1 apostrophe.",
    " ": "Limit 2 spaces."
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

      // User has many UserPickPages
      User.hasMany(models.UserPickPage, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        // hooks: true   // not needed since the UserPickPage and UserPick models have no hooks defined
      });

      // User has many UserPicks
      User.hasMany(models.UserPick, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });

      // User has one UserProfile
      User.hasOne(models.UserProfile, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });

      // Other associations for User model

      // User.hasMany(models.Comment, {
      //   foreignKey: "user_id",
      //   onDelete: "CASCADE",
      // });

      // User.hasMany(models.Post, {
      //   foreignKey: "user_id",
      //   onDelete: "CASCADE",
      // });

      // User.hasMany(models.Subscription, {
      //   foreignKey: "user_id",
      //   onDelete: "CASCADE",
      // });

      // // For followers relationship (self-referential)
      // User.belongsToMany(models.User, {
      //   through: models.Follower,
      //   as: "Followers",
      //   foreignKey: "follows_user_id",
      //   otherKey: "user_id"
      // });

      // User.belongsToMany(models.User, {
      //   through: models.Follower,
      //   as: "Following",
      //   foreignKey: "user_id",
      //   otherKey: "follows_user_id"
      // });
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [2, 40],
        isAllowedSpecialChars(name) {
          validateNameCharacters(name);
        }
      }
    },
    lastName: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        len: [2, 40],
        isAllowedSpecialChars(name) {
          validateNameCharacters(name);
        }
      }
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [8, 40],
      }
    },
    userName: {
      type: DataTypes.STRING(30),
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
            if (char === " ") throw new Error("Special characters allowed, except no spaces.");
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
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  }, {
    sequelize,
    modelName: "User",
    tableName: "users",
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "isAdmin", "createdAt", "updatedAt"]
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
