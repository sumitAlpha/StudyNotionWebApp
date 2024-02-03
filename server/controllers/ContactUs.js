const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");

exports.contactUsController = async (req, res) => {
    const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
    console.log(req.body);
    try {
        const emailRes = await mailSender(
            email,
            "Your Data send successfully",
           contactUsEmail ((email, firstname, lastname, message, phoneNo, countrycode)) 
 
        )
        console.log("emilRes", emailRes);
        res.status(200).json({
            success: true,
            message:"Email Sent Successfully"
        })
    }
    catch (error) {
        console.log("Error", error)
        console.log("Error message :", error.message)
        return res.json({
            success: false,
            message: "Something went wrong...",
        })
    
    
    }
}