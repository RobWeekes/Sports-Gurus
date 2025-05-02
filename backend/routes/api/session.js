// backend/routes/api/session.js

const express = require('express');
const { Op } = require('sequelize');
const { setTokenCookie } = require('../../utils/auth');
const router = express.Router();
const { User } = require('../../db/models');
const bcrypt = require('bcryptjs');

// Log In
router.post('/', async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential
      }
    }
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error('Login failed');
    err.status = 401;
    err.title = 'Login failed';
    err.errors = { credential: 'The provided credentials were invalid.' };
    return next(err);
  }

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    userName: user.userName,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
});

// test the login route in browser console:
// add XSRF & comment out code before running fetch command

// fetch('/api/session', {
//   method: 'POST',
//   headers: {
//     "Content-Type": "application/json",
//     "XSRF-TOKEN": `eXHiYa7w-Yj2Z1mdSZFYM9_-cbUHFPgTXBbI`
//   },
//   body: JSON.stringify({ credential: 'Demo-lition', password: 'password' })
// }).then(res => res.json()).then(data => console.log(data));




module.exports = router;
