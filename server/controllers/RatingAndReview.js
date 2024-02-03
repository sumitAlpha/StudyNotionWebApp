const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create RatingAndReview-->handler function
exports.createRatingAndReview = async (req,res) =>{
    try{
      //find UserId
      const userId = req.user.id;
      //fetch Data from request Body
      const{rating,review,courseId} = req.body;

      //student enrolled hai kya iss particular course me jisme woh rating dena chahta hai
      const courseDetails = await Course.findOne({_id:courseId,
                            studentsEnrolled:{$elemMatch:{$eq:userId}}});

            if(!courseDetails) {
                return res.status(404).json({
                 success:false,
                 message:"Student is not enrolled in this Course",
                });
            } 
       //check if User Already Reviewed the course
       const alreadyReviewed = await  RatingAndReview.findOne({
                                    user:userId,
                                    course:courseId,
                                         });

        if(!alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"User already reviewed this Course",
            });
        }
       // create rating and review ka object  
       const ratingReview = await RatingAndReview.create({
              rating, review,
            course:courseId, user:userId ,    
       });
       
       //update Course waala Schema/Model
       const updatedCourseDetail = await Course.findByIdAndUpdate({_id:courseId},
                                            {$push:{ratingAndReviews:ratingReview._id}},
                                              {new:true},).populate("ratingAndReviews");

        console.log(updatedCourseDetail);
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and reviwed Successfully",
            data:ratingReview,
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


//Get Average RatingAndReview ->handler function
exports.getAverageRating =  async (req,res) =>{
    try{
     //find CourseId
     const {courseId} = req.body;
     //calculate Average Rating
     const result = await RatingAndReview.aggregate([
        {
            $match:{
                course: new mongoose.Types.ObjectId(courseId),
            },
        },
        {
            $group:{
                _id:null,
                averageRating: { $avg: "$rating"},
            }
        }
     ])

     //return rating 
     if(result.length>0){
           return res.status(200).json({
             success:true,
             averageRating: result[0].averageRating,
          })
        }
        //if no rating/review exists
        return res.status(200).json({
            success:true,
            message:'Average Rating is 0, no ratings given till now',
            averageRating:0,
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


//get All RatingAndReview ->handler function
exports.getAllRatings = async (req,res) =>{
    try{
      const allReviews = await RatingAndReview.find({})
                                              .sort({rating:"desc"})
                                              .populate({
                                                 path:"user",
                                                 select:"firstName lastName email image",
                                                })
                                                .populate({
                                                    path:"course",
                                                    select: "courseName",
                                                }).exec();
                   //return res
                   return res.status(200).json({
                      success:true,
                     message:"All reviews fetched successfully",
                     data:allReviews,
                   });                            
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}