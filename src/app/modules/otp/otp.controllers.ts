import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from 'http-status-codes';
import { OTPServices } from "./otp.services";

const sendOTPController = asyncHandler(async(req : Request, 
    res : Response,next : NextFunction)=>{
    const {email} = req.body;
    await OTPServices.OTPSendService(email);
    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'OTP send successful',
        data : null
    });
});

const verifyOTPController = asyncHandler(async(req : Request, 
    res : Response,next : NextFunction)=>{
    const {email,otp} = req.body;
    await OTPServices.OPTVerifyService(email,otp);
    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'OTP verification successfull',
        data : null
    });
});




export const OTPControllers = {
    sendOTPController,
    verifyOTPController
}