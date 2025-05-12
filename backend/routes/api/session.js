// backend/routes/api/session.js

const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
// Session authenticators
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");
const { UserProfile } = require("../../db/models");
const bcrypt = require("bcryptjs");
// Validating login request body
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");


// "validateLogin" middleware will check for request body keys (credential: userName/email, pasword: ) and validate them (not empty)
const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors
];


// Log In
// POST /api/session
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential
      }
    }
  });

  if (!user || !bcrypt.compareSync(
    password, user.hashedPassword.toString()
  )) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "The provided credentials were invalid." };
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


// Log Out
// DEL /api/session
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
})


// Get Current User
// GET /api/session
router.get("/", async (req, res) => {
  const { user } = req;
  if (user) {
    // get user profile
    const userProfile = await UserProfile.findOne({
      where: { user_id: user.id }
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      aboutMe: userProfile ? userProfile.aboutMe : null,
      sportIcon: userProfile ? userProfile.sportIcon : "usercircle"
    };

    return res.json({
      user: safeUser
    });
  } else return res.json({ user: null });
})


// to test the login route use Postman or browser console:
// add XSRF & comment out code before running fetch command

// fetch("/api/session", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
//   },
//   body: JSON.stringify({ credential: "Demo-lition", password: "password" })
// }).then(res => res.json()).then(data => console.log(data));


// to test the log out route:

// fetch("/api/session", {
//   method: "DELETE",
//   headers: {
//     "Content-Type": "application/json",
//     "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
//   }
// }).then(res => res.json()).then(data => console.log(data));

// You should see the token cookie disappear from the list of cookies in your browser"s DevTools. If you don"t have the XSRF-TOKEN cookie anymore, use the /api/csrf/restore route to add the cookie back.



module.exports = router;
