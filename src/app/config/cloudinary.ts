import { v2 as cloudinary} from "cloudinary";
import { envs } from "./env";
import AppError from "../errorHelpers/appError";
import httpStatusCode from 'http-status-codes';
cloudinary.config({ 
     cloud_name:  envs.CLOUD_NAME, 
     api_key: envs.CLOUD_API_KEY, 
     api_secret: envs.CLOUD_API_SECRET
});


export const deleteCloudinaryImage = async(url : string) =>{

  try {
    const regex = /upload\/(?:v\d+\/)?(?:[^/]+\/)*([^/.]+(?:\/[^/.]+)*)\.[a-zA-Z0-9]+$/;
    const match = url.match(regex);

    
    if(match && match[1]){
          const publicId = match[1];
          await cloudinary.uploader.destroy(publicId);
          console.log('file', url)
    }
  } catch (err : any) {
     throw new AppError(httpStatusCode.BAD_REQUEST,err.message); 
  }
}

export const cloudinaryUpload = cloudinary;