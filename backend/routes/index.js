// backend/routes/index.js

// create an Express router, create a test route, and export the router

const express = require('express');
const router = express.Router();


// All the API routes will be served at URL's starting with /api/
const apiRouter = require('./api');

router.use('/api', apiRouter);

// All the URLs of the routes in the api router will be prefixed with /api


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
