import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authServices } from "./auth.services";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/appError";
import { setAuthTokens } from "../../utils/setAuthTokens";


const authLoginController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const user = await authServices.authLoginService(req.body);
    setAuthTokens(res,user);
    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'User logged in successful',
        data : user
    });
});


const getAccessTokenController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new AppError(httpStatusCode.BAD_REQUEST, 'Refresh token not found')
    }
    const token = await authServices.getAccessTokenService(refreshToken);

    setAuthTokens(res,token)

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'New Access Token retrived successful',
        data : {
           accessToken : token.accessToken
        }
    });
});

const authLogoutController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    
    res.clearCookie('accessToken',{
        httpOnly : true,
        secure : false,
        sameSite : 'lax'
    })

    res.clearCookie('refreshToken',{
        httpOnly : true,
        secure : false,
        sameSite : 'lax'
    })
    
    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'User logout successfull',
        data : null
    });
});
const authResetPasswordController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{

    const userData = req.user;
    const {newPassword,oldPassword} = req.body;

    await authServices.resetPasswordService(oldPassword,newPassword,userData);

    
    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'Password reset successfull',
        data : null
    });
});


export const authController ={
    authLoginController,
    getAccessTokenController,
    authLogoutController,
    authResetPasswordController
}
