import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from 'http-status-codes';
import { divisionServices } from "./division.services";

// create division controller
const createDivisionController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const data = await divisionServices.createDivisionService(req.body);

    sendResponse(res,{
        statusCode : httpStatusCode.CREATED,
        success : true,
        message : 'Division created',
        data 
    });
});

// get all divisions controller
const getAllDivisionsController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const results = await divisionServices.getAllDivisionsService();

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'Divisions retrived',
        data : results.data,
        meta : {  total : results.meta.totalDivisions }
    });
});

// get signle division controller
const getSingleDivisionController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const slug = req.params.slug;
    const results = await divisionServices.getSingleDivisionService(slug);

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'Division retrived',
        data : results
    });
});


export const divisionControllers = {
    createDivisionController,
    getAllDivisionsController,
    getSingleDivisionController
}