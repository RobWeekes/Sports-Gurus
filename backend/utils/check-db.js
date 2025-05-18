const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

async function checkDb() {
  try {
    // Find the database file
    const dbPath = path.join(__dirname, '../db/dev.db');
    if (!fs.existsSync(dbPath)) {
      console.error(`Database file not found at ${dbPath}`);
      return;
    }

    console.log(`Database file found at ${dbPath}`);

    // Create a direct connection
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
      logging: false
    });

    // List all tables
    const [tables] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table'");
    console.log("Available tables:", tables.map(t => t.name));

    // Check each table
    for (const table of tables) {
      try {
        // Check table structure
        const [columns] = await sequelize.query(`PRAGMA table_info("${table.name}")`);
        console.log(`\nColumns in ${table.name}:`, columns.map(c => c.name));

        // Check for user-like columns
        const hasUserFields = columns.some(c => c.name === 'firstName' || c.name === 'lastName' || c.name === 'email');
        if (hasUserFields) {
          console.log(`${table.name} looks like a users table!`);

          // Check if isAdmin column exists
          const hasIsAdmin = columns.some(c => c.name === 'isAdmin');
          console.log(`${table.name} has isAdmin column: ${hasIsAdmin}`);

          // Check for users
          const [users] = await sequelize.query(`SELECT * FROM "${table.name}" LIMIT 5`);
          console.log(`Sample users in ${table.name}:`, users);
        }
      } catch (error) {
        console.error(`Error checking table ${table.name}:`, error);
      }
    }

    // Close the connection
    await sequelize.close();
  } catch (error) {
    console.error("Error checking database:", error);
    console.error(error.stack);
  } finally {
    process.exit();
  }
}

checkDb();
