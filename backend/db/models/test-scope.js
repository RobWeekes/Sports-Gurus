const { User } = require('../models');

async function testScope() {
  try {
    // This should exclude hashedPassword, email, createdAt, updatedAt
    const users = await User.findAll();
    console.log("Default scope:", JSON.stringify(users, null, 2));

    // This will include all fields
    const usersWithAllFields = await User.scope('withAllFields').findAll();
    console.log("All fields:", JSON.stringify(usersWithAllFields, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testScope();
