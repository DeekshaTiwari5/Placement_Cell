const fs = require("fs");
const Student = require("../models/student");

module.exports.downloadCSVReport = async function (req, res) {
  try {
    const allStudents = await Student.find({});
    let report = "student Id, Student name, Student college, Student email, Student status, DSA Final Score, WebD Final Score, React Final Score, Interview date, Interview company, Interview result";

    for (let student of allStudents) {
      const studentData = [
        student.id,
        student.name,
        student.college,
        student.email,
        student.placement_status,
        student.dsa_score,
        student.webdev_score,
        student.react_score,
      ];

      if (student.interviews.length > 0) {
        for (let interview of student.interviews) {
          const interviewData = [
            interview.date.toString(),
            interview.company,
            interview.result,
          ];
          const rowData = studentData.concat(interviewData);
          report += "\n" + rowData.join(", ");
        }
      }
    }

    const filePath = "uploads/studentsReport.csv";

    fs.writeFile(filePath, report, function (err) {
      if (err) {
        console.error(err);
        return res.redirect("back");
      }

      return res.download(filePath, "studentsReport.csv", function (err) {
        if (err) {
          console.error(err);
          return res.redirect("back");
        }

        // Clean up the temporary CSV file
        fs.unlink(filePath, function (err) {
          if (err) {
            console.error("Error deleting the CSV file:", err);
          }
        });
      });
    });
  } catch (err) {
    console.error(err);
    return res.redirect("back");
  }
};
