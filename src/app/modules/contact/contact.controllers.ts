import { NextFunction, Request, Response } from "express";
import httpStatusCode from "http-status-codes";
import { userServices } from "./contact.services";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";

const contact = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await userServices.contactService(req.body);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Thank you! We've received your message",
      data: null,
    });
  },
);

export const contactControllers = {
  contact,
};
