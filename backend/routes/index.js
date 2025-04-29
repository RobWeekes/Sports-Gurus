// backend/routes/index.js

// create an Express router, create a test route, and export the router

const express = require('express');
const router = express.Router();


// In this test route, set a cookie on the response with the name 'XSRF-TOKEN' to the value of the req.csrfToken method's return. Then, send "Hello World!" as the response body
// router.get('/hello/world', function (req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });


// Add a route, GET /api/csrf/restore to allow any developer to re-set the CSRF token cookie XSRF-TOKEN.
router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});




module.exports = router;
