const {instance} = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");

//capture PAYMENT And Initiate the PAYMENT

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    //get courseId and UserID
    const {course_id} = req.body;
    const userId = req.user.id;
    //validation
    //valid courseID
    if(!course_id) {
        return res.json({
            success:false,
            message:'Please provide valid course ID',
        })
    };
    //valid courseDetail
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course) {
            return res.json({
                success:false,
                message:'Could not find the course',
            });
        }

        //user already pay for the same course
        //Converted String to ObjectId (userId)
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success:false,
                message:'Student is already enrolled',
            });
        }
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
   //create  Order
   const amount = course.price;
   const currency = "INR";
   const options = {
     amount : amount*100,
     currency,
     receipt:Math.random(Date.now()).toString(),
     notes:{
         courseId: course_id,
         userId,
       }
    };
    try{
       //initiate the payment using razorpay
       const paymentResponse = instance.orders.create(options);
       console.log(paymentResponse);
       //return res
       return res.status(200).json({
         success:true,
         courseName:course.courseName,
         courseDescription:course.courseDescription,
         thumbnail: course.thumbnail,
         orderId: paymentResponse.id,
         currency:paymentResponse.currency,
         amount:paymentResponse.amount,
        });
    }
    catch(error){
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }
};

//verify Signature of Razorpay and server
exports.verifySignature = async (req,res) =>{
    
      //server secret
      const webhookSecret = "12345678";

      //send by razorpay after hittng the Apiroute(Signature)
       const signature = req.headers["x-razorpay-signature"];

       const shasum = crypto.createHmac("sha256",webhookSecret);
       shasum.update(JSON.stringify(req.body));
       const digest = shasum.digest("hex");

      //Matching (webhookSecret and  signature)
       if(signature === digest){
         console.log("Payment is Authorised");
          
         //find courseId and UserId(request send by Razorpay)
         const{courseId,userId} = req.body.payload.payment.entity.notes;
           try{
             //fullfil the Action
              
             //find the course and enroll the student in it
             const enrolledCourse = await Course.findByIdAndUpdate({_id:courseId},
                                                        {$push:{studentsEnrolled: userId}},
                                                          {new:true},);
                
             if(!enrolledCourse) {
                 return res.status(500).json({
                     success:false,
                     message:'Course not Found',
                    });
                }  
                console.log(enrolledCourse);
             
            
                //find the student and add the course to their list enrolled courses me 
                const enrolledStudent = await User.findByIdAndUpdate({_id:userId},
                                                       {$push:{courses: courseId}},
                                                         {new:true},); 

             if(!enrolledStudent) {
                return res.status(500).json({
                    success:false,
                    message:'Student not Found',
                   });
               } 
             
               //mailsend for Confirmation
               const emailResponse = await mailSender(
                 enrolledStudent.email,
                 "Congratulations from CodeHelp",
                 "Congratulations, you are onboarded into new CodeHelp Course",
                )
                console.log(emailResponse);
                return res.status(200).json({
                    success:true,
                    message:"Signature Verified and COurse Added",
                });
            }
           catch(error){     
             return res.status(500).json({
                 success:false,
                 message:error.message,
               });
            }    
        }
        else{
            return res.status(400).json({
                success:false,
                message:'Invalid request',
            });
        }
};
