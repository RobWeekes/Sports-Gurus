// backend/routes/api/users.js

const express = require("express")
const router = express.Router();
// // Session authenticators
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, UserProfile } = require("../../db/models");
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
    .optional({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("If provided, username must be at least 4 characters."),
  check("userName")
    .optional({ checkFalsy: true })
    .not()
    .isEmail()
    .withMessage("If provided, username cannot be an email address."),
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


// Get a Specific User"s Public Profile
// GET /api/users/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      attributes: ["id", "userName", "firstName", "lastName", "createdAt"],
      include: [{
        model: UserProfile,
        attributes: ["aboutMe", "sportIcon"]
      }]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING


// Get a User"s Prediction Statistics
// GET /api/users/:userId/stats
router.get("/:userId/stats", requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    // ensure user can only access their own stats or make this public
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // get total picks, correct picks, etc.
    const totalPicks = await UserPick.count({ where: { user_id: userId } });
    const correctPicks = await UserPick.count({
      where: { user_id: userId, result: "WIN" }
    });

    return res.json({
      stats: {
        totalPicks,
        correctPicks,
        accuracy: totalPicks > 0 ? (correctPicks / totalPicks) * 100 : 0
      }
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// ERROR {"message": "Server error"}


// Update User"s Profile
// PUT /api/users/:userId/profile
router.put("/:userId/profile", requireAuth, async (req, res) => {
  const { userId } = req.params;
  const { aboutMe, sportIcon } = req.body;
  // console.log("Updating profile for user:", userId, { aboutMe, sportIcon });

  // ensure user can only update their own profile
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    // find or create the user profile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId }
    });

    if (!userProfile) {
      userProfile = await UserProfile.create({
        user_id: userId,
        aboutMe: aboutMe || "",
        sportIcon: sportIcon || "usercircle"
      });
    } else {  // update existing profile
      await userProfile.update({
        aboutMe: aboutMe !== undefined ?
          aboutMe : userProfile.aboutMe,
        sportIcon: sportIcon !== undefined ?
          sportIcon : userProfile.sportIcon
      });
    }

    // get the updated user with profile
    const user = await User.findByPk(userId, {
      attributes: {
        include: ["email", "createdAt", "updatedAt"]
      },
      include: [{
        model: UserProfile,
        attributes: ["aboutMe", "sportIcon"]
      }]
    });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      aboutMe: userProfile.aboutMe,
      sportIcon: userProfile.sportIcon
    };

    return res.json({ user: safeUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// WORKING




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
