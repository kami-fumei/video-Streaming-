import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


const cloudUpload = async (localPath) => {
  if (!localPath) return null;

  let cloudinaryResponse = null;

  try {
    cloudinaryResponse = await cloudinary.uploader.upload(localPath, {
      resource_type: 'auto',
    });
  } catch (error) {
    console.error('Cloud upload error:', error);
    // Optionally, rethrow or handle error as needed
  } finally {
    try {
       fs.unlinkSync(localPath);
      //  console.log('File successfully deleted');
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError);
    }
  }

  return cloudinaryResponse;
};


export { cloudUpload };
