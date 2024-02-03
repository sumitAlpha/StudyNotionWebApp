const express = require ("express");
const router = express.Router();
const {auth} = require("../middlewares/auth");

// Import the required controllers and middleware functions
const {updateProfile, deleteAccount, getAllUserDetails, updateDisplayImage, getEnrolledCourses} = require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

//Delete user's Profile
router.delete("/deleteProfile", auth, deleteAccount);

//Update users profile
router.put("/updateProfile", auth, updateProfile);

//get users  allDetails
router.get("/getUserDetails", auth, getAllUserDetails);

//update Display image of User
router.put("/updateDisplayImage", auth,  updateDisplayImage);

//Get Enrolled courses of users
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

module.exports = router;
