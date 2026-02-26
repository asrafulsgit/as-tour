import { NextFunction, Request, Response } from "express";
import httpStatusCode from "http-status-codes";
import { userServices } from "./user.services";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface";

const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await userServices.userCreateService(req.body);

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: "User created",
      data: null,
    });
  },
);

const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const decodedToken = req.user;
    const image = req.file?.path;
    const payload: Partial<IUser> = {
      ...req.body,
      picture: image,
    };
    const user = await userServices.userUpdateService(
      userId,
      payload,
      decodedToken as JwtPayload,
    );

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "User updated",
      data: user,
    });
  },
);

const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await userServices.getAllUserService(query as Record<string, string>);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Users retrived sucessfully.",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userData = await userServices.getUserService(user);
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "User retrived sucessfully.",
      data: userData,
    });
  },
);
const getUserDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;
    const userData = await userServices.getUserDetailsService(userId);
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "User retrived sucessfully.",
      data: userData,
    });
  },
);

const getUserBookingStats = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const userBookingsStats = await userServices.getUserBookingStatsService(
      user.id,
    );
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "User Booking stats retrived sucessfully.",
      data: userBookingsStats,
    });
  },
);

export const userControllers = {
  createUser,
  updateUser,
  getAllUsers,
  getUser,
  getUserBookingStats,
  getUserDetails
};
