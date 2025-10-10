import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from 'http-status-codes'; 
import { tourTypeServices } from "./tour.services";

// create tourType controller
const createTourTypeController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const data = await tourTypeServices.createTourTypeService(req.body);

    sendResponse(res,{
        statusCode : httpStatusCode.CREATED,
        success : true,
        message : 'tourType created',
        data 
    });
});

// get all tourTypes controller
const getAllTourTypesController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const results = await tourTypeServices.getAllTourTypeService();

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'tourTypes retrived',
        data : results.data,
        meta : {  total : results.meta.totalTourTypes }
    });
});

// get signle tourType controller
const getSingleTourTypeController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const tourTypeId = req.params.id;
    const results = await tourTypeServices.getSingleTourTypeService(tourTypeId);

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'tourType retrived',
        data : results
    });
});

// update tourType controller
const updateTourTypeController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const tourTypeId = req.params.id;

    const results = await tourTypeServices.updateTourTypeService(tourTypeId,req.body);

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'tourType updated',
        data : results
    });
});

// delete tourType controller
const deletetourTypeController = asyncHandler(async (req: Request, res: Response) => {
    const toutTypeId = req.params.id;
    await tourTypeServices.deleteTourTypeService(toutTypeId);
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "tourType deleted",
        data: null
    });
});


export const tourTypeControllers = {
    createTourTypeController,
    getAllTourTypesController,
    getSingleTourTypeController,
    updateTourTypeController,
    deletetourTypeController
}