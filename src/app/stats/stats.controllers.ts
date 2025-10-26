
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResponse } from "../utils/sendResponse";

const getBookingStatsController = asyncHandler(async(req: Request, res: Response) => {
    // const stats = await StatsService.getBookingStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking stats fetched successfully",
        data: null,
    });
});

const getPaymentStatsController = asyncHandler(async (req: Request, res: Response) => {
    // const stats = await StatsService.getPaymentStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment stats fetched successfully",
        data: null,
    });
});

const getUserStatsController = asyncHandler(async (req: Request, res: Response) => {
    // const stats = await StatsService.getUserStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: null,
    });
});

const getTourStatsController = asyncHandler(async (req: Request, res: Response) => {
    // const stats = await StatsService.getTourStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tour stats fetched successfully",
        data: null,
    });
});

export const statsControllers = {
     getBookingStatsController,
getPaymentStatsController,
getUserStatsController,
getTourStatsController
};