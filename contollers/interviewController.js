const Student = require("../models/student");
const Interview = require("../models/interview");


// Render the "Add Interview" page
module.exports.addInterview = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("add_interview", {
      title: "Schedule An Interview",
    });
  }

  return res.redirect("/");
};
// Create a new interview
module.exports.create = async (req, res) => {
  try {
    const { company, date } = req.body;
    
    // Create a new interview document using the 'await' keyword
    const interview = await Interview.create({
      company,
      date,
    });
    
    //req.flash("success", "Interview added!");
    return res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    req.flash("error", "Couldn't add Interview!");
    return res.redirect("back");
  }
};

// Enroll a student in an interview
module.exports.enrollInInterview = async (req, res) => {
  try {
    const { email, result } = req.body;
    const interviewId = req.params.id;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.redirect("back");
    }

    const student = await Student.findOne({ email: email });
    if (!student) {
      return res.redirect("back");
    }

    const isAlreadyEnrolled = await Interview.findOne({
      _id: interviewId,
      "students.student": student.id,
    });

    if (isAlreadyEnrolled) {
      if (isAlreadyEnrolled.company === interview.company) {
        req.flash(
          "error",
          `${student.name} is already enrolled in ${interview.company} interview!`
        );
        return res.redirect("/dashboard");
      }
    }

    const studentObj = {
      student: student.id,
      result: result,
    };

    await interview.updateOne({
      $push: { students: studentObj },
    });

    const assignedInterview = {
      company: interview.company,
      date: interview.date,
      result: result,
    };

    await student.updateOne({
      $push: { interviews: assignedInterview },
    });

    console.log(
      "success",
      `${student.name} enrolled in ${interview.company} interview!`
    );

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.redirect("back");
  }
};

// Deallocate students from an interview
module.exports.deallocate = async (req, res) => {
  try {
    const { studentId, interviewId } = req.params;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.redirect("back");
    }

    await Interview.updateOne(
      { _id: interviewId },
      { $pull: { students: { student: studentId } } }
    );

    await Student.updateOne(
      { _id: studentId },
      { $pull: { interviews: { company: interview.company } } }
    );

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.redirect("back");
  }
};
