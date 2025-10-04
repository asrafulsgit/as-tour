import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/appError";
import httpStatusCode from 'http-status-codes';
import { envs } from "../config/env";

export const authentication = (...roles : string[])=>async(req : Request ,res : Response,next : NextFunction)=>{
    try {
        const token = req.headers.authorization;
        
        if(!token) throw new AppError(httpStatusCode.NOT_FOUND, "Token not found.");
        
        const verified = jwt.verify(token,envs.JWT_ACCESS_TOKEN_SECRET) as JwtPayload;
        
        
        if(!roles.includes((verified as JwtPayload).role)){
            throw new AppError(httpStatusCode.FORBIDDEN,"You can not view this route!")
        }
        req.user = verified;
        next()
    } catch (error) {
        next(error);
    }
}
