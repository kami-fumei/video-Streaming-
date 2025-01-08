import { v2 as cloudinary } from 'cloudinary';
import fs, { link } from 'fs';

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
    // console.log('file uploaded successfully :', cloudinary_response.url);

    fs.unlinkSync(localPath);

    return cloudinary_response;
  } catch (error) {
    fs.unlinkSync(localPath);
    return null;  
  }
};

export { cloudUpload };
