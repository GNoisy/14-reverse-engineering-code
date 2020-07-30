// Requiring necessary npm packages

//express is required -- allows javascript to be run outside of browser
var express = require("express");

//express-session is used to store user data between http requests
var session = require("express-session");

// passport is middleware for node that is used for authentication
var passport = require("./config/passport");

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();

//allows the use of nested objects if extended is true, cannot if false
app.use(express.urlencoded({ extended: true }));

//recognizes incoming request as json object
app.use(express.json());

//allows the use of what's inside public folder
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
