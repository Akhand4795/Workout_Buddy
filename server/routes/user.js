const express = require("express");

// Controller Functions --------------------------------
const { loginUser, signupUser } = require("../controller/userController");

const router = express.Router();

// Login routes
router.post("/login", loginUser);

//Signup routes
router.post("/signup", signupUser);

module.exports = router;
