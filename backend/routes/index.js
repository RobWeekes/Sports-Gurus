// backend/routes/index.js

// create an Express router, create /api/csrf/restore route below
const express = require("express");
const router = express.Router();


// All the API routes will be served at URL"s starting with /api/
const apiRouter = require("./api");

// All the URLs of the routes in the api router will be prefixed with /api
router.use("/api", apiRouter);

// Restore the XSRF-TOKEN cookie
// In production, the backend also serves up all the frontend assets, including the index.html and any JS files in the frontend/build folder after running "npm run build" in frontend dir. The XSRF-TOKEN will be attached to the index.html file in the frontend/dist folder. Serve this index.html file at the / route and any routes that don"t start with /api

// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  // Serve the frontend"s index.html file at the root route
  router.get("/", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "dist", "index.html")
    );
  });

  // Serve the static assets in the frontend"s build folder
  router.use(express.static(path.resolve("../frontend/dist")));

  // Serve the frontend"s index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "dist", "index.html")
    );
  });
} // This route is essential for proper functioning of a React single page app with client-side routing when deployed to production, where both the frontend & backend are served from the same server. It ensures that all non-API routes serve the React application, allowing React Router to handle the client-side routing.


// In this test route, set a cookie on the response with the name "XSRF-TOKEN" to the value of the req.csrfToken method"s return. Then, send "Hello World!" as the response body
// router.get("/hello/world", function (req, res) {
//   res.cookie("XSRF-TOKEN", req.csrfToken());
//   res.send("Hello World!");
// });


// Add a route, GET /api/csrf/restore to allow any developer to reset the CSRF token cookie "XSRF-TOKEN". *Add script to Postman as shown below \/
if (process.env.NODE_ENV !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    // return res.json({});  // sends token without displaying it
    res.status(200).json({
      "XSRF-Token": csrfToken
    });  // code from backend starter
  });
}



module.exports = router;


// *In Postman, add this "Post-response" script to pass JSON response value into Postman environment. Run "Get CSRF Token" once after opening Postman. csrftoken will be accessible for all non-GET routes after that:

// // original script:
// var xsrfCookie = postman.getResponseCookie("XSRF-TOKEN");
// postman.setEnvironmentVariable("xsrftoken", xsrfCookie.value);

// // other script working with backend starter:
// var responseJson = pm.response.json();
// var token = responseJson["XSRF-Token"];
// if (token) {
//     pm.environment.set("xsrftoken", token);
//     console.log("Set environment variable "xsrftoken" to:", token);
// } else {
//     console.log("XSRF-Token not found in response body!");
// }
