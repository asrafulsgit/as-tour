import { NextFunction, Request, Response } from "express";
import httpStatusCode from "http-status-codes";
import { userServices } from "./user.services";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

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
    const user = await userServices.userUpdateService(
      userId,
      req.body,
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
    const result = await userServices.getAllUserService();

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Users retrived sucessfully.",
      data: result.users,
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

export const userControllers = {
  createUser,
  updateUser,
  getAllUsers,
  getUser,
};
