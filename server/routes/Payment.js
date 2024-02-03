const express = require("express");
const router = express.Router();


// Import the required controllers and middleware functions
const { capturePayment, verifySignature} = require("../controllers/Payments");

const{ auth, isStudent } = require("../middlewares/auth");


// ********************************************************************************************************
//                                      Payments routes
// ********************************************************************************************************

//capture Payment
router.post("/capturePayment", auth, isStudent,  capturePayment) 

//verify Signature
router.post("/verifySignature", verifySignature);

module.exports = router;