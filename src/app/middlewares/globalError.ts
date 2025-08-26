import { NextFunction, Request, Response } from "express";
import { envs } from "../config/env";
import AppError from "../errorHelpers/appError";

export const globalErrorHandle = (err : any , req : Request, res : Response, next : NextFunction)=>{
    let statusCode = 500;
    let message = `Something went wrong!`;

    if(err instanceof AppError){
        statusCode = err.statusCode;
        message = err.message;
    }else if(err instanceof Error){
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