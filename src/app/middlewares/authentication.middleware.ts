import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/appError";
import httpStatusCode from "http-status-codes";
import { envs } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";
import { CUSTOM_ERROR } from "../utils/constants";
import { clearTokens } from "../utils/clearTokens";

export const authentication =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken || req.headers.authorization;

      if (!token) {
        throw new AppError(
          httpStatusCode.NOT_FOUND,
          "Token not found.",
          CUSTOM_ERROR.TOKEN_NOT_FOUND,
        );
      }
      const verified = jwt.verify(
        token,
        envs.JWT_ACCESS_TOKEN_SECRET,
      ) as JwtPayload;

      const isUserExist = await User.findById(verified.id);

      if (!isUserExist) {
        throw new AppError(
          httpStatusCode.NOT_FOUND,
          "User not found",
          CUSTOM_ERROR.USER_NOT_FOUND,
        );
      }

      if (!isUserExist.isVerified) {
        clearTokens(res);
        throw new AppError(
          httpStatusCode.BAD_REQUEST,
          `User is not verified`,
          CUSTOM_ERROR.USER_NOT_VERIFIED,
        );
      }
      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        clearTokens(res);
        throw new AppError(
          httpStatusCode.BAD_REQUEST,
          `User is ${isUserExist.isActive}`,
          isUserExist.isActive === IsActive.BLOCKED
            ? CUSTOM_ERROR.USER_BLOCKED
            : CUSTOM_ERROR.USER_INACTIVE,
        );
      }

      if (isUserExist.isDeleted) {
        throw new AppError(
          httpStatusCode.BAD_REQUEST,
          `User is deleted`,
          CUSTOM_ERROR.USER_DELETED,
        );
      }

      if (!roles.includes((verified as JwtPayload).role)) {
        throw new AppError(
          httpStatusCode.FORBIDDEN,
          "You can not view this route!",
          CUSTOM_ERROR.ROLE_FORBIDDEN,
        );
      }
      req.user = verified;
      next();
    } catch (error) {
      next(error);
    }
  };
