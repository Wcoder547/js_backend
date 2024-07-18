import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      // crop: 'auto',
      // gravity: 'auto',
      // width: 500,  // for image crop
      // height: 500,  // Transform the image: auto-crop to square aspect_ratio
    });
    //console.log("file is uploaded on cloudinary", await response.url);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err.message}`);
        return;
      }
      console.log("File deleted successfully");
    });
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    try {
      fs.unlinkSync(localFilePath);
      console.log("Local file deleted successfully");
    } catch (unlinkError) {
      console.error("Error deleting local file:", unlinkError);
    }
    return null;
  }
};

export { uploadOnCloudinary };
