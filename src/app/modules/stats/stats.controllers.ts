
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { statsServices } from "./stats.services";

const getBookingStatsController = asyncHandler(async(req: Request, res: Response) => {
    const stats = await statsServices.getBookingStatsService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking stats fetched successfully",
        data: stats,
    });
});

const getPaymentStatsController = asyncHandler(async (req: Request, res: Response) => {
    const stats = await statsServices.getPaymentStatsService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment stats fetched successfully",
        data: stats,
    });
});

const getUserStatsController = asyncHandler(async (req: Request, res: Response) => {
    const stats = await statsServices.getUserStatsService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});

const getTourStatsController = asyncHandler(async (req: Request, res: Response) => {
    const stats = await statsServices.getTourStatsService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour stats fetched successfully",
        data: stats,
    });
});

export const statsControllers = {
     getBookingStatsController,
getPaymentStatsController,
getUserStatsController,
getTourStatsController
};