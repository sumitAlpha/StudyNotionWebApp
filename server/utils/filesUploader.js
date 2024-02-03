// Require the Cloudinary library
const cloudinary = require('cloudinary').v2;

exports.uploadFilesToCloudinary = async (file, folder, quality, height) => {
  try {
    const options = {
      folder,
      resource_type: "auto" // Set the resource type to "auto"
    };

    // Set optional parameters if provided
    if (height) {
       options.height = height;
     }
    if (quality) {
       options.quality = quality;
     }

    console.log("Temp file path:", file.tempFilePath);

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
    
   } catch (error) {
    throw new Error("Error uploading file to Cloudinary: " + error.message);
  }
};