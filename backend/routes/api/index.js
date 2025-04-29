// backend/routes/api/index.js

const router = require('express').Router();

// All the URLs of the routes in the api router will be prefixed with /api

// test route
router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});



module.exports = router;



// Example fetch request:

// fetch('/api/test', {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "XSRF-TOKEN": `<value of XSRF-TOKEN cookie>`
//   },
//   body: JSON.stringify({ hello: 'world' })
// }).then(res => res.json()).then(data => console.log(data));
