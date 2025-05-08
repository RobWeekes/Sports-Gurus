// backend/config/database.js

const config = require("./index");

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      schema: process.env.SCHEMA
    }
  }
};


// This will allow you to load the database configuration environment variables from the .env file into the config/index.js, as well as define the global schema for the project.

// When you deploy application to production, the database will be read from a URL path instead of a local database file. Also use PostgresQL in production rather than SQLite3 as a SQL database management system. SQLite3 should be used ONLY in development.
