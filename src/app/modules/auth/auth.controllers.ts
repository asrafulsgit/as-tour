import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authServices } from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from 'http-status-codes';


const authLoginController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const user = await authServices.authLoginService(req.body);

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'User logged in successful',
        data : user
    });
})
export const authController ={
    authLoginController
}
