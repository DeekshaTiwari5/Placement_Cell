const Student = require("../models/student");
const Interview = require("../models/interview");


// Dashboard route handler
module.exports.dashboard = async function (req, res) {
  try {
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
      // Fetch all students and populate their 'interviews' field
      let students = await Student.find({}).populate("interviews");

      // Fetch all interviews and populate the 'students.student' field
      let interviews = await Interview.find({}).populate("students.student");

      // Render the 'dashboard' view and pass the data as variables
      return res.render("dashboard", {
        title: "Dashboard",
        all_students: students,
        all_interviews: interviews,
      });
    } else {
      // If the user is not authenticated, redirect to the homepage or login page
      return res.redirect("/");
    }
  } catch (err) {
    // Handle any errors that occur during the process
    console.log(err);
    return res.redirect("back"); // Redirect back to the previous page in case of an error
  }
};
