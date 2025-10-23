import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary";
import { v4 as uuidv4 } from 'uuid';
import multer from "multer";


const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
        const fileName = file.originalname.split(".").slice(0,-1);
        
            const uniqueFileName = uuidv4() + "-" + Date.now() + 
            "-" + fileName; 

            return uniqueFileName
    }
  },
});


export const multerUpload = multer({storage : storage});