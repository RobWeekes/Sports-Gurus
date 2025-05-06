'use strict';

const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class UserPickPage extends Model {
    static associate(models) {

      // UserPickPage belongs to a User
      UserPickPage.belongsTo(models.User, {
        foreignKey: 'user_id'
      });

      // UserPickPage has many UserPicks
      UserPickPage.hasMany(models.UserPick, {
        foreignKey: 'page_id',
        onDelete: 'CASCADE'
      });

      // // UserPickPage has many Subscriptions through pageName
      // UserPickPage.hasMany(models.Subscription, {
      //   foreignKey: 'userpickpages_name',
      //   sourceKey: 'pageName',
      //   constraints: false
      // });  // sourceKey: 'pageName' - for a relationship based on the pageName column rather than the primary key
      // // constraints: false - no formal foreign key constraint - for relationships connecting tables through a non-primary key field

      // // UserPickPage has many Comments through pageName
      // UserPickPage.hasMany(models.Comment, {
      //   foreignKey: 'userpickpages_name',
      //   sourceKey: 'pageName',
      //   constraints: false
      // });

      // // UserPickPage has many Posts through pageName
      // UserPickPage.hasMany(models.Post, {
      //   foreignKey: 'userpickpages_name',
      //   sourceKey: 'pageName',
      //   constraints: false
      // });


      // // Make sure that the Subscription, Comment, and Post models are properly defined and that they have the corresponding belongsTo relationships back to the UserPickPage model. For example:

      // // In Subscription model
      // Subscription.belongsTo(models.UserPickPage, {
      //   foreignKey: 'userpickpages_name',
      //     targetKey: 'pageName',
      //     constraints: false
      // });

      // // Similar for Comment and Post models

    }
  }

  UserPickPage.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pageName: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        len: [1, 40]
      }
    }
  }, {
    sequelize,
    modelName: 'UserPickPage',
    tableName: "userpickpages",
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'pageName'],
        name: 'unique_user_pagename'
      }
    ]
  });

  return UserPickPage;
};
