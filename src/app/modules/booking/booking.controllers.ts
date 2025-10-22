import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from 'http-status-codes';
import { bookingServices } from "./booking.services";
import { JwtPayload } from "jsonwebtoken";

// create booking controller
const createBookingController = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    
    const result = await bookingServices.createBookingService(req.body,user.id);
    
    sendResponse(res, {
        statusCode: httpStatusCode.CREATED,
        success: true,
        message: 'Booking created successfully',
        data: result
    });
});

// get all booking controller
const getAllBookingController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    // const results = await tourServices.getAllToursService(req.query as Record<string,string>);

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'tours retrived',
        data : 'results.data'
    });
});

// get signle booking controller
const getSingleBookingController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const tourId = req.params.id;
    // const results = await tourServices.getSingleTourService(tourId);

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'tour retrived',
        data : 'results'
    });
});

// update booking controller
const updateBookingController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
    const tourId = req.params.id;
    
    // const results = await tourServices.updateTourService(tourId,req.body);

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'tour updated',
        data : 'results'
    });
});

// delete booking controller
const deleteBookingController = asyncHandler(async (req: Request, res: Response) => {
    const tourId = req.params.id;
    // await tourServices.deleteTourService(tourId);
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "tour deleted",
        data: null
    });
});

export const bookingControllers = {
    createBookingController
}