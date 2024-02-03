const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const {uploadFilesToCloudinary} = require("../utils/filesUploader");


//createSubSection ->handler Function
exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description } = req.body
    const video = req.files.video

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" })
    }
    console.log(video)

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadFilesToCloudinary(
      video,
      process.env.FOLDER_NAME
    )
    console.log(uploadDetails)
    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    })

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: SubSectionDetails._id } },
      { new: true }
    ).populate("subSection")

    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedSection })
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

//update SubSection -->Handler function
exports.updateSubSection = async (req,res) =>{
  try{
   //data fetch from request body.
   const {sectionId, title, description,subSectionId } = req.body;

   const subSection = await SubSection.findById(subSectionId);
   //validation
   if(!subSection){
       return res.status(404).json({
       success: false,
       message: "SubSection not found",
      });
    }
   //if user provided these values ,then update in subsection's objects.
    if (title !== undefined) {
      subSection.title = title
    }
    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadFilesToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }
    await subSection.save();

    //updated Subsection send kro data ma
   const updatedSection = await Section.findById(sectionId).populate("subSection");
    //return res
    return res.status(200).json({
      success: true,
      data:updatedSection,
      message:"SubSection Updated Successfully",
    });                                                       
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"SubSection cannot Be Updated",
    });
  }
};

//Delete SubSection ->HANDLER FUNCTION
exports.deleteSubSection = async (req,res) =>{
 try{
   //data fetching
   const{subSectionId,sectionId} = req.body;

   //delete from section model
   await Section.findByIdAndDelete({_id:sectionId},
     { $pull: { subSection: subSectionId } }
   );

   //delete from subsection model
   await SubSection.findByIdAndDelete(subSectionId);
  
   //updated Subsection send kro data me
   const updatedSection = await Section.findById(sectionId).populate("subSection");

   //return res
   return res.status(200).json({
    success:true,
     message: "SubSection Deleted Successfully",
      data:updatedSection,
    });
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
       success:false,
       message:"Unable to Delete SubSection,Please try Again",
     });
    }
}