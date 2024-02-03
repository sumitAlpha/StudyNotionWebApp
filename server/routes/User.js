//Import the requied Modules
const express = require('express');
const router = express.Router();

// Import the required controllers and middleware functions
const {sendOtp, signup,login, changePassword } = require("../controllers/Auth");

const {resetPasswordToken, resetPassword} = require("../controllers/ResetPassword");

const {auth} = require("../middlewares/auth");

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

//Route for user login
router.post("/login", login);

//Route for signup
router.post("/signup", signup);

// Route for sending OTP to the user's email
router.post("/sendotp", sendOtp);

// Route for Changing the password
router.post("/changepassword", auth, changePassword);

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

//Route for Generating a Reset Password Token
router.post("/reset-password-token",resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);
module.exports = router;

