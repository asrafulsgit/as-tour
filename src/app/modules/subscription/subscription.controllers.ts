import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/appError";
import httpStatusCode from "http-status-codes";
import { Subscription } from "./subscription.model";
const createSubscriptionController = asyncHandler(
  async (req: Request, res: Response) => {
    const email = req.body.email;
    if (!email) {
      throw new AppError(httpStatusCode.BAD_REQUEST, "Email is required.");
    }
    const isExist = await Subscription.findOne({ email });
    if (isExist) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        "You have already subscribed.",
      );
    }
    await Subscription.create({ email });
    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: "Subscription successfull",
      data: null,
    });
  },
);

export const subscriptionControllers = {
  createSubscriptionController,
};
