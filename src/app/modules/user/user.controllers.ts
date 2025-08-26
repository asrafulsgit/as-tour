import { NextFunction, Request, Response } from "express";
import httpStatusCode from 'http-status-codes';
import { userServices } from "./user.services";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";


const createUser = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const user = await userServices.userCreateService(req.body);

    sendResponse(res,{
        statusCode : httpStatusCode.CREATED,
        success : true,
        message : 'User created',
        data : user
    });
})

const getAllUsers = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const result = await userServices.getAllUserService();


    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'Users retrived sucessfully.',
        data : result.users,
        meta : result.meta
    })
})


export const userControllers = {
    createUser,
    getAllUsers
}