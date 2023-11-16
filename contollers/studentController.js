const Interview = require("../models/interview");
const Student = require("../models/student");

// Render add student page
module.exports.addStudent = (req, res) => {
  if (req.isAuthenticated()) {
    return res.render("add_student", {
      title: "Add Student",
    });
  }

  return res.redirect("/");
};

// Render edit student page
module.exports.editStudent = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  try {
    const student = await Student.findById(req.params.id);

    return res.render("edit_student", {
      title: "Edit Student",
      student_details: student,
    });
  } catch (err) {
    console.error(err);
    return res.redirect("back");
  }
};

// Create a new student
module.exports.create = async (req, res) => {
  try {
    const {
      name,
      email,
      batch,
      college,
      placementStatus,
      dsa_score,
      react_score,
      webdev_score,
    } = req.body;

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.redirect("back");
    }

    await Student.create({
      name,
      email,
      college,
      batch,
      dsa_score,
      react_score,
      webdev_score,
      placementStatus,
    });

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.redirect("back");
  }
};

// Delete a student
module.exports.destroy = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.redirect("back");
    }

    const interviewsOfStudent = student.interviews;

    // Delete references to the student from associated interviews
    if (interviewsOfStudent.length > 0) {
      for (let interview of interviewsOfStudent) {
        await Interview.findOneAndUpdate(
          { company: interview.company },
          { $pull: { students: { student: studentId } } }
        );
      }
    }

    await student.deleteOne();

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.redirect("back");
  }
};

// Update student details
module.exports.update = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.redirect("back");
    }

    const {
      name,
      college,
      batch,
      dsa_score,
      react_score,
      webdev_score,
      placementStatus,
    } = req.body;

    student.name = name;
    student.college = college;
    student.batch = batch;
    student.dsa_score = dsa_score;
    student.react_score = react_score;
    student.webdev_score = webdev_score;
    student.placementStatus = placementStatus;

    await student.save();

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.redirect("back");
  }
};
