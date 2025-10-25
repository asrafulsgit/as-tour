import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from 'http-status-codes';
import { OTPServices } from "./otp.services";

const sendOTPController = asyncHandler(async(req : Request, 
    res : Response,next : NextFunction)=>{
    await OTPServices.OTPSendService(req.body);
    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'OTP send successful',
        data : null
    });
});

export const OTPControllers = {
    sendOTPController
}