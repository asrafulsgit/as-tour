import { Request, Response } from "express";
import { envs } from "../config/env";

export const globalErrorHandle = (err : any , req : Request, res : Response)=>{
    const status = 500;
    const message = `Something went wrong! ${err.message}`;

    res.status(status).json({
        success : false,
        message,
        err,
        stack : envs.NODE_ENV === 'development' ? err.stack : null
    })
}