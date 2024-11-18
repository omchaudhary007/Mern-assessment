import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';


const uploadFileToCloudinary = (file, folderName, genericFileName) => {
  
  // creating unique fileName
  const fileName =`${genericFileName}${uuidv4()}${Date.now()}`;

  // returning uploading promise
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: folderName || "Default",
        public_id: fileName,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(file.buffer);
  });
};


const deleteFromCloudinary=(public_id)=>{
  return cloudinary.uploader.destroy(public_id);
}
export{
  uploadFileToCloudinary,
  deleteFromCloudinary
}
