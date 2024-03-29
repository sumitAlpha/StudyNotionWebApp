const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema({
  email:{
     type:String,
     required:true,
    },

    otp:{
        type:String,
        required:true,
    },

    createdAt:{
       type:Date,
       default:Date.now(),
       expires:60*5, // The document will be automatically deleted after 5 minutes of its creation time
    },
});
// a function- to send mails
async function sendVerificationEmail (email,otp){
    try{
     const mailresponse = await mailSender(email,
        "Verification Email",
			emailTemplate(otp)
          );
     console.log("Mail Sent Successfully:",mailresponse.response);
    }
    catch(error){
        console.log( "error occured while sending mails:",error);
        throw error;
    }
}
// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save",async function(next){
    console.log("New document saved to database");

    // Only send an email when a new document is created
    if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
    next();
});

module.exports = mongoose.model("OTP",OTPSchema);