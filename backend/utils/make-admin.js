const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

async function makeAdmin() {
  try {
    // Find the database file
    const dbPath = path.join(__dirname, '../db/dev.db');
    if (!fs.existsSync(dbPath)) {
      console.error(`Database file not found at ${dbPath}`);
      return;
    }

    // Create a direct connection
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
      logging: false
    });

    // Use the correct table name
    const tableName = 'users';

    // Check if user with ID 2 exists
    const [users] = await sequelize.query(`SELECT * FROM "${tableName}" WHERE id = 4`);

    if (users.length === 0) {
      console.error(`User with ID 4 not found in ${tableName}!`);
      return;
    }

    console.log(`Found user in ${tableName}:`, users[0]);

    // Update the user to be an admin
    await sequelize.query(`UPDATE "${tableName}" SET "isAdmin" = 1 WHERE id = 4`);
    console.log(`User with ID 4 in ${tableName} is now an admin!`);

    // Verify the update
    const [updatedUsers] = await sequelize.query(`SELECT * FROM "${tableName}" WHERE id = 4`);
    console.log(`Updated user in ${tableName}:`, updatedUsers[0]);

    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error("Error making user admin:", error);
    console.error(error.stack);
  } finally {
    process.exit();
  }
}

makeAdmin();



// run script:
// cd backend
// node utils/make-admin.js




// LONG VERSION

// // import the models index file
// const db = require('../db/models');

// async function makeAdmin() {
//   try {
//     // Log what models are available
//     console.log("Available models:", Object.keys(db));

//     // Check if User model exists
//     if (!db.User) {
//       console.error("User model not found in db object!");
//       return;
//     }

//     // Find the user
//     const user = await db.User.findByPk(2); // Change to the user ID you want

//     if (!user) {
//       console.error("User not found!");
//       return;
//     }

//     console.log("User found:", user.toJSON());

//     // Update the user to be an admin
//     user.isAdmin = true;
//     await user.save();

//     console.log("User updated to admin:", user.toJSON());
//   } catch (error) {
//     console.error("Error making user admin:", error);
//   } finally {
//     // Close the database connection
//     if (db.sequelize) {
//       await db.sequelize.close();
//     }
//     process.exit();
//   }
// }

// makeAdmin();


// makeAdmin(userId);


// run script:
// cd backend
// node utils/make-admin.js

// OR run the script with a user ID as an argument:

// node utils/make-admin.js 4
// Makes user with ID 4 an admin
