// backend/routes/api/users.js

const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();


// Sign Up
// POST /api/users
router.post('/', async (req, res) => {
  const { firstName, lastName, email, password, userName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  const user = await User.create({
    firstName, lastName, email, userName, hashedPassword
  });

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

// to test new valid user signup, run in browser devtools:

// fetch('/api/users', {
//   method: 'POST',
//   headers: {
//     "Content-Type": "application/json",
//     "XSRF-TOKEN": `q51K2UQL-4XgkG86SvQHmx3wEDvresXHHMuE`
//   },
//   body: JSON.stringify({
//     firstName: 'Peter',
//     lastName: 'Parker',
//     email: 'spidey@spider.man',
//     userName: 'Spidey',
//     password: 'password'
//   })
// }).then(res => res.json()).then(data => console.log(data));



module.exports = router;
