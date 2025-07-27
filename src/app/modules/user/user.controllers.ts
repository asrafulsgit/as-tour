import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatusCode from 'http-status-codes';
import { userServices } from "./user.services";


const createUser = async(req : Request, res : Response,next : NextFunction)=>{
    try {
        const user = await userServices.userCreateService(req.body)
        res.status(httpStatusCode.CREATED).json({
            success : true,
            message : 'User created',
            user
        })
    } catch (error : any) {
        console.log(`create user ${error.message}`)
        next(error)
        // res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        //     success : false,
        //     message : `Something Went wrong while creating user`,
        //     error : error.message
        // })
    }
}


export const userControllers = {
    createUser
}