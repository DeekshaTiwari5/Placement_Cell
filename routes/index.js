const express = require("express");
const router = express.Router(); // Change "routers" to "router"

console.log("router reloaded");

// user routes
router.use("/", require("./users"));

// student routes
router.use("/student", require("./student"));

// interview routes
router.use("/interview", require("./interview"));

module.exports = router; // Use "router" to export the router
