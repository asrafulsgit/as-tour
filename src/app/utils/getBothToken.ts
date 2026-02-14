import { JwtPayload } from "jsonwebtoken";
import { envs } from "../config/env";
import AppError from "../errorHelpers/appError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { decodedToken } from "./decodedToken";
import { generateToken } from "./generateToken";
import httpStatusCode from "http-status-codes";

export const getBothToken = (user: Partial<IUser>) => {
  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    tokenPayload,
    envs.JWT_ACCESS_TOKEN_SECRET,
    envs.JWT_ACCESS_TOKEN_EXPIRESIN,
  );
  const refreshToken = generateToken(
    tokenPayload,
    envs.JWT_REFRESH_TOKEN_SECRET,
    envs.JWT_REFRESH_TOKEN_EXPIRESIN,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createAccessTokenFromRefreshToken = async (
  refreshToken: string,
) => {
  const verifyToken = decodedToken(
    refreshToken,
    envs.JWT_REFRESH_TOKEN_SECRET,
  ) as JwtPayload;
  const isUserExist = await User.findById(verifyToken.id);

  if (!isUserExist) {
    throw new AppError(httpStatusCode.NOT_FOUND, "User not found");
  }

  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      `User is ${isUserExist.isActive}`,
    );
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpStatusCode.BAD_REQUEST, `User is deleted`);
  }
  const tokenPayload = {
    id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const newAccessToken = generateToken(
    tokenPayload,
    envs.JWT_ACCESS_TOKEN_SECRET,
    envs.JWT_ACCESS_TOKEN_EXPIRESIN,
  );
  return newAccessToken;
};
