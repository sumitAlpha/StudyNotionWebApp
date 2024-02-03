const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const {uploadFilesToCloudinary} = require("../utils/filesUploader");
require("dotenv").config();

//Update Profile -->Handler function
exports.updateProfile = async (req,res) =>{
   try{
      //data fetch from request body
      const{ DateofBirth = "" ,about ="" ,contactNumber,gender} = req.body;

      //find UserId
      const id = req.user.id;

     // Find the profile by id
	   const userDetails = await User.findById(id);
	   const profile = await Profile.findById(userDetails.additionalDetails);

      //update  the Profile fields
      profile.DateofBirth = DateofBirth;
      profile.about = about;
      profile.contactNumber = contactNumber;
      profile.gender = gender;

      //Db me save karo 
      await profile.save();

      //return response
      return res.status(200).json({
         success:true,
         message:"Successfully Updated Profile",
         profile,
       });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
           success:false,
           error: error.message,
        });
    }
};

//deleteAcccount -->Handler function
exports.deleteAccount = async(req,res) =>{
    try{
       // const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job); 
        console.log("Printing ID: ", req.user.id);
      //Get User id
      const id = req.user.id;
      //validation
      const userDetails = await User.findById(id);
      if(!userDetails){
         return res.status(404).json({
             success:false,
             message:"User Details not found",
          });
        }
        // Delete Assosiated Profile with the User
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
         
        //delete CourseSchema studentsEnrolled
        await Course.findByIdAndDelete({_id:userDetails.courses});

         //delete UserSchema se userid
        await User.findByIdAndDelete({_id:id});
        //return response
        return res.status(200).json({
             success:true,
             message:"User Deleted Successfully"
        });

    }
    catch(error){
     console.log(error.message);
     return res.status(500).json({
         success:false,
         message:"User Cannot Deleted,Please try again Later",
        })
    }
};

//GetAllUserDetails -->Handler function

exports.getAllUserDetails = async(req,res) =>{
    try{
    //get user Id
    const id = req.user.id;
    //validation
    const userDetails = await User.findById(id);
     console.log(userDetails)
    //return response
    return res.status(200).json({
         success:true,
         message:"User Data Fetched Successfully",
         data: userDetails,
        });
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"User Details Cannot be Find,Please try Again Later",
        });
    }
};

//updateDisplayImage ->Handler function
exports.updateDisplayImage = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture;
      console.log(displayPicture);
      const userId = req.user.id
      const image = await uploadFilesToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

//GetEnrolledCourses -> Handler function
exports.getEnrolledCourses = async (req,res) =>{
    try{
      //fetch userId
      const userId = req.user.id;
      const userDetails = await User.findById({_id:userId})
      .populate("courses")
      .exec()
      //validation
      if(!userDetails){
          return res.status(400).json({
             success: false,
             message: `Could not find user with id: ${userDetails}`,
           });
        }
      //return successful response.
      return res.status(200).json({
         success:true,
         data: userDetails.courses,
       });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};