const express = require("express");
const passport = require("passport");
const router = express.Router();

const { dashboard } = require("../contollers/dashBoardController");
const { downloadCSVReport } = require("../contollers/reportController");

// Requiring files
const {
  profile,
  updateUser,
  signIn,
  signUp,
  create,
  createSession,
  destroySession,
} = require("../contollers/userController");

// Routes for checking the profile and updating user profile
router.get("/profile", passport.checkAuthentication, profile);
router.post("/update", passport.checkAuthentication, updateUser);

// Route for the dashboard
router.get("/dashboard", dashboard);

// Route for the sign-in page
router.get("/", signIn);

// Route for the sign-up page
router.get("/sign-up", signUp);

// Route for creating a new user
router.post("/create", create);

// Route for using Passport as middleware to authenticate
router.post("/create-session", passport.authenticate("local", { failureRedirect: "/" }), createSession);

// Route for logging out
router.get("/sign-out", destroySession);

// Route for downloading CSV reports
router.get("/download", downloadCSVReport);

module.exports = router;
