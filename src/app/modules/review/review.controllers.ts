import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { reviewServices } from "./review.services";
// create review controller
const createReviewController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    await reviewServices.createReviewService(req.body, user.id);

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: "Review created",
      data: null,
    });
  },
);

// get all reviews controller
const getAllReviewsController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourId = req.params.tourId as string;
    const results = await reviewServices.getAllReviewsService(tourId);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Reviews retrived",
      data: results.data,
      meta: { total: results.meta.totalRevies },
    });
  },
);

// delete review controller
const deleteReviewController = asyncHandler(
  async (req: Request, res: Response) => {
    const reviewId = req.params.id as string;
    await reviewServices.deleteReviewService(reviewId);
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Review deleted",
      data: null,
    });
  },
);

export const reviewControllers = {
  createReviewController,
  getAllReviewsController,
  deleteReviewController,
};
