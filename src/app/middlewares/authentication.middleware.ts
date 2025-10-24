import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errorHelpers/appError";
import httpStatusCode from "http-status-codes";
import { envs } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const authentication =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken  || req.headers.authorization;
      
      if (!token){
        throw new AppError(httpStatusCode.NOT_FOUND, "Token not found.");
}
      const verified = jwt.verify(
        token,
        envs.JWT_ACCESS_TOKEN_SECRET
      ) as JwtPayload;
      const isUserExist = await User.findById(verified.id);

      if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User not found");
      }
      
      if (
        !isUserExist.isVerified
      ) {
        throw new AppError(
          httpStatusCode.BAD_REQUEST,
          `User is not verified`
        );
      }
      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatusCode.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }

      if (isUserExist.isDeleted) {
        throw new AppError(httpStatusCode.BAD_REQUEST, `User is deleted`);
      }

      if (!roles.includes((verified as JwtPayload).role)) {
        throw new AppError(
          httpStatusCode.FORBIDDEN,
          "You can not view this route!"
        );
      }
      req.user = verified;
      next();
    } catch (error) {
      next(error);
    }
  };
