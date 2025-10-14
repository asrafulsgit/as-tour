import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from 'http-status-codes'; 
import { tourServices, tourTypeServices } from "./tour.services";
import { Tour } from "./tour.model";

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
};


// create tour controller
const createTourController = asyncHandler(async (req: Request, res: Response) => {
    const result = await tourServices.createTourService(req.body);
    sendResponse(res, {
        statusCode: httpStatusCode.CREATED,
        success: true,
        message: 'Tour created successfully',
        data: result,
    });
});

// get all tours controller
const getAllToursController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const results = await tourServices.getAllToursService();

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'tours retrived',
        data : results.data,
        meta : {  total : results.meta.totalTours }
    });
});

// get signle tour controller
const getSingleTourController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const tourId = req.params.id;
    const results = await tourServices.getSingleTourService(tourId);

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'tour retrived',
        data : results
    });
});

// update tour controller
const updateTourController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const tourId = req.params.id;
    
    const results = await tourServices.updateTourService(tourId,req.body);

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'tour updated',
        data : results
    });
});

// delete tour controller
const deletetourController = asyncHandler(async (req: Request, res: Response) => {
    const tourId = req.params.id;
    await tourServices.deleteTourService(tourId);
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "tour deleted",
        data: null
    });
});

export const tourControllers = {
    createTourController,
    getAllToursController,
    getSingleTourController,
    updateTourController,
    deletetourController
}