// backend/routes/api/index.js

const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");

// imports used for session/authorization functions:
const { restoreUser } = require("../../utils/auth.js");
const { setTokenCookie } = require("../../utils/auth.js");
const { User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");

// All the URLs of routes in the api router will be prefixed with /api

// connect "restoreUser" to the router before any other middleware or route handlers are connected. If current user session is valid, set req.user to the user in the database
router.use(restoreUser);

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.post("/test", (req, res) => {
  res.json({ requestBody: req.body });
});




// // ***************************** // //
// // RESTORE TEST ROUTES IF NEEDED // //

// // test "restoreUser" middleware & see if the req.user key has been populated by the middleware
// // GET /api/restore-user
// router.get("/restore-user", (req, res) => {
//   return res.json(req.user);
// });   // response = demo user info as JSON. Then, remove the token cookie in your browser DevTools & refresh. response = empty/null


// // test "requireAuth" middleware: this represents any auth route
// // GET /api/require-auth
// router.get("/require-auth", requireAuth, (req, res) => {
//   return res.json(req.user);
// });   // If there is no session user, return an error. To test:
// // delete token in browser DevTools & refresh: "Auth. required"
// // Otherwise response = session user info. Restore: /set-token-cookie


// // test the setTokenCookie function with a demo user
// // GET /api/set-token-cookie
// router.get("/set-token-cookie", async (_req, res) => {
//   const user = await User.findOne({
//     where: { username: "Demo-lition" }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });   // should see a token cookie in browser DevTools


// // test route req.body
// // POST /api/test
// router.post("/test", function (req, res) {
//   res.json({ requestBody: req.body });
// });
// // You can now remove the POST /api/test test route in your backend code, as you won"t be needing it anymore -- frontend-phase-0


// // RESTORE TEST ROUTES IF NEEDED // //
// // ***************************** // //


module.exports = router;


// Example fetch request:

// fetch("/api/test", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
//   },
//   body: JSON.stringify({ hello: "world" })
// }).then(res => res.json()).then(data => console.log(data));
