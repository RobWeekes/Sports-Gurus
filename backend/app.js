// backend/app.js

const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const { ValidationError } = require("sequelize");   // Sequelize error handler

// Create a variable called isProduction that will be true if the environment is in production or not by checking the environment key in the configuration file (backend/config/index.js):

const { environment } = require("./config");
const isProduction = environment === "production";


// Initialize the Express application:
const app = express();

// Connect morgan middleware for logging info about requests & responses:
app.use(morgan("dev"));

// Add the cookie-parser middleware for parsing cookies and the express.json middleware for parsing JSON bodies of requests with Content-Type of "application/json"
app.use(cookieParser());
app.use(express.json());


// Add security middlewares:

// (Cross-Origin Resource Sharing): not needed in production since all React & Express resources will come from the same origin
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
); // allow images with URLs to render in deployment

// Set the _csrf token and create req.csrfToken method *
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);


// Connect all the routes
app.use(routes);


// Error handlers: 1) Resource Not Found, 2) Sequelize, 3) Error Formatter

// 1) Catch unhandled requests and forward to error handler
app.use((_req, _res, next) => {   // regular middleware (no "err" arg.)
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});   // next invoked with an error means error handlers defined after this middleware will be invoked. next() -> error handlers not invoked

// 2) Catch Sequelize errors & format them before sending the error response
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = "Validation error";
    err.errors = errors;
  }
  next(err);
});

// 3) Format all the errors before returning a JSON response
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});   // this should be the last middleware in the app.js file




module.exports = app;

// * The csurf middleware will add a _csrf cookie that is HTTP-only (can"t be read by JavaScript) to any server response. It also adds a method on all requests (req.csrfToken) that will be set to another cookie (XSRF-TOKEN) later on. These two cookies work together to provide CSRF (Cross-Site Request Forgery) protection for your application. The XSRF-TOKEN cookie value needs to be sent in the header of any request with all HTTP verbs besides GET. This header will be used to validate the _csrf cookie to confirm that the request comes from your site and not an unauthorized site.
