require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var passport = require("passport");
var passportGoogleAuth = require('passport-google-oauth20');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app, passport);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

//
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK
}, 
function(accessToken, refreshToken, data, cb) {
  console.log(data);
  var email = data.emails[0].value;
  var google_id = data.id;

  //try to find user
  db.User.findOne({
    google_id: google_id
  })
  .then(function(user){
    if(!user){
      // SAVE USER DATA HERE
      db.User.create({
        email: email,
        google_id: google_id
      })
      .then(function(user){
        //more magic after creating the user
        return cb(null, user);
      });
    }
    else{
      //more magic after finding the user
      return cb(null, user);
    }
  })
  .catch( err => {
    console.log(err);
    return cb(err, null);
  });
}));

// when we save a user to a session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// when we retrieve the data from a user session
passport.deserializeUser(function(id, done) {
  db.User.findOne({ where: {id: id }})
  .then(function (user) {
      done(null, user);
  })
  .catch(error => {
      console.log(error);
      done(error, false);
  })
  ;
});

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
