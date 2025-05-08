// backend/routes/api/users.js

const express = require("express")
const router = express.Router();
// // Session authenticators
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
// Validating signup request body
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");


const validateSignup = [
  check("firstName")
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("Please provide a first name with at least 2 characters."),
  check("lastName")
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("Please provide a last name with at least 2 characters."),
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email address."),
  check("userName")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("userName")
    .not()
    .isEmail()
    .withMessage("Username is optional, cannot be an email address."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  check("password")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)."),
  handleValidationErrors
];


// Sign Up
// POST /api/users
router.post("/", validateSignup, async (req, res) => {
  const { firstName, lastName, email, userName, password } = req.body;
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

// fetch("/api/users", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "XSRF-TOKEN": `q51K2UQL-4XgkG86SvQHmx3wEDvresXHHMuE`
//   },
//   body: JSON.stringify({
//     firstName: "Peter",
//     lastName: "Parker",
//     email: "spidey@spider.man",
//     userName: "Spidey",
//     password: "password"
//   })
// }).then(res => res.json()).then(data => console.log(data));



module.exports = router;
