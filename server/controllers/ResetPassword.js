
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
// const bcrypt = require("bcrypt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");


//resetPasswordToken (token created using crypto.random UUID)

exports.resetPasswordToken = async (req, res) =>{
    try{
     //data fetch from request ki body
     const email = req.body.email;

     //user find karo uss email ke liye and Validation 
     const user = await User.findOne({email:email});

     //if user not found
     if(!user){
         return res.status(401).json({
             success:false,
             message: `This Email: ${email} is not Registerd With Us Enter a Valid Email`,  
           });
        }

        //generate token using crypto.random UUID 
        const token =  crypto.randomBytes(20).toString("hex");
        // update the details in User Model 
        const updatedDetails =  await User.findOneAndUpdate({email:email},
                                                 {token : token,
                                                 resetPasswordExpires: Date.now() + 3600000,},
                                                  {new:true});
        console.log("Details",updatedDetails);                                         

        //create a Url-> yeah frontend ka Url hai
        const url = `http://localhost:3000/update-password/${token}`;

        //send Mail containing the url.
        await mailSender(email,
            "Password Reset Link",
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        //return response
        return res.status(200).json({
             success:true,
             message:"Email Sent Successfully,Please Check Your Email to Continue Further",
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:  `Some Error in Sending the Reset Message`,
        });
    }
};

//reset Password - updation tmhre User model ke andr password wale property/field me.
exports.resetPassword = async (req,res) =>{
  try{
        //request ki body se fetch karo token ko-> sent by frontend
        const{password, confirmPassword, token} = req.body;

        //validation for password and confirm password.
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password does not match with confirm Password"
            })
        }

        //Get User details from database using token for verifying the token
        const userDetails = await User.findOne({token: token});
        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:"Token is Invalid",
            });
        }
        //Token Time check
        if(!(userDetails.resetPasswordExpires > Date.now())){
            return res.status(403).json({
             success:false,
             message:"Token is expired, Please Generate a new Token",
            });
        }

        //password HASSED
        const hassedPassword =  await bcrypt.hash(password, 10);

        //db me store krna hai yeah new password ko
        await User.findOneAndUpdate({token:token},
                                         {password:hassedPassword},
                                         {new:true});
        //return res
        return res.status(200).json({
            success:true,
            message:"Password Reset Successful",
       });                            
    }  
    catch(error){
      console.log(error.message);
       return res.status(500).json({
         success:false,
         message:"Something went wrong while reset the Password Mail",
      });
    }
};
