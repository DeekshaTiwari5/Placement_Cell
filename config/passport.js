const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;


// Authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true, // allows to set the first argument as req
    },
    async function (req, email, password, done) {
      try {
        // Find the user and establish the identity
        const user = await User.findOne({ email: email });

        if (!user) {
          // Use flash messages to provide feedback to the user
           req.flash("error", "Invalid Username or Password");
          return done(null, false);
        }

        // Match the password
        const isPasswordCorrect = await user.isValidatePassword(password);

        if (!isPasswordCorrect) {
          // Use flash messages to provide feedback to the user
          // console.log("Invalid Username or Password");
           req.flash("error", "Invalid Username or Password");
          return done(null, false);
        }
         // Add a success flash message for login
         req.flash("success", "Login successful!");

        return done(null, user);
      } catch (err) {
        console.log("Error in finding the user", err);
        return done(err);
      }
    }
  )
);

// Serializing the user to choose which key should be kept in cookies
passport.serializeUser(function (user, done) {
  // Use the user's ID as the key in the cookie
  done(null, user.id);
});

// Deserializing the user from the key in the cookies
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found");
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    console.log("Error in finding user ---> Passport", err);
    return done(err);
  }
});

// Check if the user is authenticated (middleware)
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/"); // Redirect to the login page or another appropriate page
};

// Set the authenticated user in response locals
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
