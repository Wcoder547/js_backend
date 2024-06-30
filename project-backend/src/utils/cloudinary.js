import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_NAME,
  api_secret: process.env.CLOUDINARY_NAME,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      //   crop: 'auto',
      //   gravity: 'auto',
      //   width: 500,  for image crop
      //   height: 500,  // Transform the image: auto-crop to square aspect_ratio
    });
    console.log("file is uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlink(localFilePath);
    return null;
  }
};
