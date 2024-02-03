const express = require('express');
const router = express.Router()

//importing the contactus Controller 
const { contactUsController } = require("../controllers/ContactUs");

router.post("/contact", contactUsController)
module.exports = router