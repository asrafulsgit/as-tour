import { NextFunction, Request, Response } from "express";
import { envs } from "../config/env";
import AppError from "../errorHelpers/appError";
import { deleteCloudinaryImage } from "../config/cloudinary";

export const globalErrorHandle = async(err : any , req : Request, res : Response, next : NextFunction)=>{
    let statusCode = 500;
    let message = `Something went wrong!`;

    // delete single image when api has error
    if(req.file){
        await deleteCloudinaryImage(req.file.path);
    }

    // delete multiple images when api has error
    if(req.files && Array.isArray(req.files) && req.files.length){
        const images = (req.files as Express.Multer.File[]).map(file => file.path);
        await Promise.all(images.map(image => deleteCloudinaryImage(image)));
    }

    //mongoose duplicate error
    if(err.code === 11000){
        statusCode = 400;
        const duplicate = err.message.match(/"([^"]*)"/)[1];
        message = `${duplicate} already exist!`
    }
    //mongoose CastError 
    else if(err.name === 'CastError'){
        statusCode = 400;
        message = 'Invalid mongoDB object ID, Please provide valid ID.'
    }
    //mongoose ValidationError
    else if(err.name === "ValidationError"){
        statusCode = 400;
        message = "Invalid Input"
    }
    // here will be add a zod error

    // custom error 
    else if(err instanceof AppError){
        statusCode = err.statusCode;
        message = err.message;
    }
    // server error 
    else if(err instanceof Error){
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        success : false,
        message,
        err,
        stack : envs.NODE_ENV === 'development' ? err.stack : null
    })
}