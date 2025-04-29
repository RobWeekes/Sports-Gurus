// backend/routes/index.js

// create an Express router, create a test route, and export the router

const express = require('express');
const router = express.Router();

router.get('/hello/world', function (req, res) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

// In this test route, set a cookie on the response with the name 'XSRF-TOKEN' to the value of the req.csrfToken method's return. Then, send "Hello World!" as the response body



module.exports = router;
