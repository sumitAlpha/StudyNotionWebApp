const express = require("express");
const router = express.Router();


// Import the required controllers and middleware functions

// Course Controllers Import
const{createCourse, showAllCourses,  getCourseDetails } = require("../controllers/Course");

// Categories Controllers Import
const{createCategory, categoryPageDetails, showAllCategories} = require("../controllers/Category");

// Sections Controllers Import
const{createSection, updateSection, deleteSection} = require("../controllers/Section");

// Sub-Sections Controllers Import
const {createSubSection, updateSubSection, deleteSubSection } = require("../controllers/SubSection");

// Rating Controllers Import
const{createRatingAndReview, getAverageRating, getAllRatings} = require("../controllers/RatingAndReview");


// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");


// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse) ;

//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);

// Update a Section
router.post("/updateSection", auth , isInstructor, updateSection);

//Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);

// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);

// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);

// Get all Registered Courses
router.get("/getAllCourses", showAllCourses);

// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails);



// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
router.post("/createCategory", auth, isAdmin, createCategory);

//Show All categories
router.get("/showAllCategories", showAllCategories);

//getCategoryPageDetails
router.post("/getCategoryPageDetails", categoryPageDetails);


// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

//create a ratingAndReview by Students
router.post("/createRating", auth, isStudent, createRatingAndReview);

//get Average Rating of a course
router.get("/getAverageRating", getAverageRating);

//Get All ratings.
router.get("/getReviews", getAllRatings);

module.exports = router;