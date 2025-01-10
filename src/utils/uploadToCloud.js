import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudUpload = async (localPath) => {
  try {
    if (!localPath) return null;
    
 const cloudinary_response = await cloudinary.uploader.upload(localPath, {
      resource_type: 'auto',
    });
    return cloudinary_response;

  } catch (error) {
    console.error('Error uploading file:', error);
    return null;  
  }
};

export { cloudUpload };
