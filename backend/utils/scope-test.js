// const { Sequelize, DataTypes } = require('sequelize');
// const config = require('../config');
// const UserModel = require('../db/models/user');

// // Create a new Sequelize instance
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: config.dbFile || 'db/dev.db'
// });

// // Initialize the User model directly
// const TestUser = UserModel(sequelize, DataTypes);



// // This file is for testing scope limiting fields in sequelize / possible backend route requests.

// // For testing "all fields" query, enable "withAllFields" scope in user model file. Otherwise: SequelizeScopeError: Invalid scope...

// // run this command in /backend:
// // node utils/scope-test.js



// async function testScope() {
//   try {
//     // This should exclude hashedPassword, email, createdAt, updatedAt
//     const users = await TestUser.findAll();
//     console.log("Default scope:", JSON.stringify(users, null, 2));

//     // This will include all fields
//     // const usersWithAllFields = await TestUser.scope('withAllFields').findAll();
//     // console.log("All fields:", JSON.stringify(usersWithAllFields, null, 2));
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     // Close the connection
//     await sequelize.close();
//   }
// }

// testScope();
