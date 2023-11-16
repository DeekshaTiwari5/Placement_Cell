const express = require("express");
const router = express.Router();

const {
  addInterview,
  create,
  enrollInInterview,
  deallocate,
} = require("../contollers/interviewController");


// -------- Get requests ----------

// redering add interview page
router.get("/add-interview", addInterview);

// deallocate the student from the interview
router.get("/deallocate/:studentId/:interviewId", deallocate);

// -------- Post Requests ---------

// creating a new interview
router.post("/create", create);

// enrolling student in an interview
router.post("/enroll-in-interview/:id", enrollInInterview);


// exporting the router
module.exports = router;