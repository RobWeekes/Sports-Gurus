const { User } = require('../db/models');
const { requireAdmin } = require('../utils/auth');


async function testAdminMiddleware() {
  try {
    // console.log('Testing admin middleware...');

    // get admin user (ID 2)
    const adminUser = await User.findByPk(2);
    if (!adminUser) {
      console.error('Admin user with ID 2 not found');
      return;
    }

    // get non-admin user (ID 4)
    const regularUser = await User.findByPk(4);
    if (!regularUser) {
      console.error('Regular user with ID 4 not found');
      return;
    }

    // console.log('Admin user:', adminUser.firstName, adminUser.lastName);
    // console.log('isAdmin:', adminUser.isAdmin);

    // console.log('Regular user:', regularUser.firstName, regularUser.lastName);
    // console.log('isAdmin:', regularUser.isAdmin);

    // test requireAdmin middleware with admin user
    const reqAdmin = { user: adminUser };
    const resAdmin = {};
    const nextAdmin = (err) => {
      if (err) {
        console.error('requireAdmin middleware returned an error for admin user:', err);
      } else {
        // console.log('requireAdmin middleware passed for admin user');
      }
    };

    requireAdmin(reqAdmin, resAdmin, nextAdmin);

    // test requireAdmin middleware with regular user
    const reqRegular = { user: regularUser };
    const resRegular = {};
    const nextRegular = (err) => {
      if (err) {
        // console.log('requireAdmin middleware correctly returned an error for regular user:', err.message);
      } else {
        console.error('requireAdmin middleware incorrectly passed for regular user');
      }
    };

    requireAdmin(reqRegular, resRegular, nextRegular);
  } catch (error) {
    console.error('Error testing admin middleware:', error);
    console.error(error.stack);
  } finally {
    process.exit();
  }
}


testAdminMiddleware();
