import { NextFunction, Request, Response } from "express";



type asyncFn = (req : Request, res : Response, next : NextFunction) => Promise<void>

export const asyncHandler = (fn : asyncFn)=>{
        return (req : Request, res : Response, next : NextFunction)=>{
            fn(req,res,next).catch((err)=> next(err))
        }
}