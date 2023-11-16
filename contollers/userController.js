const User = require("../models/user");

// Render the user's profile
module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "User Profile",
    profile_user: req.user,
  });
};

// Update user details
module.exports.updateUser = async function (req, res) {
  try {
    const user = await User.findById(req.user.id);
    const { username, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.redirect("back");
    }

    if (!user) {
      return res.redirect("back");
    }

    user.username = username;
    user.password = password;

    await user.save(); // Ensure you await the save operation
    return res.redirect("back");
  } catch (err) {
    console.error(err);
    return res.redirect("back");
  }
};

// Render the Sign In page
module.exports.signIn = (req, res) => {
  if (req.isAuthenticated()) {
    req.flash('info', 'You are already signed in.');
    return res.redirect("/profile");
  }
  return res.render("signin.ejs", { message: req.flash('error') });
};
// render the Sign Up page
module.exports.signUp = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  return res.render("signup.ejs");
};

// creating up a new user
module.exports.create = async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;

    // If passwords don't match
    if (password !== confirm_password) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect("back");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      await User.create({
        email,
        password,
        username,
      });
      req.flash('success', 'Account created successfully! Please sign in.');
      return res.redirect("/");
    } else {
      req.flash('error', 'Email already registered.');
      return res.redirect("/sign-up");
    }
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    return res.redirect("back");
  }
};

// Sign in and create a session for the user
module.exports.createSession = (req, res) => {
  req.flash('success', 'Logged in successfully!');
  return res.redirect("/dashboard");
};

// Clear the user's session (log out)
module.exports.destroySession = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    req.flash('info', 'Logged out successfully.');
    return res.redirect("/");
  });
};