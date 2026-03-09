import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatusCode from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envs } from "../../config/env";
import {
  createAccessTokenFromRefreshToken,
  getBothToken,
} from "../../utils/getBothToken";
import { sendEmail } from "../../utils/sendMail";
import { CUSTOM_ERROR } from "../../utils/constants";

const authLoginService = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(
      httpStatusCode.NOT_FOUND,
      "User is not found.",
      CUSTOM_ERROR.USER_NOT_FOUND,
    );
  }

  const isCorrectPassword = await bcrypt.compare(
    password as string,
    isUserExist.password as string,
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "Incorrect password.");
  }

  if (!isUserExist.isVerified) {
    throw new AppError(
      httpStatusCode.UNAUTHORIZED,
      `User is not verified`,
      CUSTOM_ERROR.USER_NOT_VERIFIED,
    );
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
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

  const toekns = getBothToken(isUserExist);
  const user = isUserExist.toObject();
  delete user.password;

  return {
    accessToken: toekns.accessToken,
    refreshToken: toekns.refreshToken,
    user,
  };
};

const getAccessTokenService = async (token: string) => {
  const newAccessToken = await createAccessTokenFromRefreshToken(token);

  return {
    accessToken: newAccessToken,
  };
};
const changePasswordService = async (
  oldPassword: string,
  newPassword: string,
  userData: JwtPayload,
) => {
  const user = await User.findById(userData.id);
  const isCorrectPassword = await bcrypt.compare(
    oldPassword,
    user?.password as string,
  );
  if (!isCorrectPassword) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      "Old password does not match",
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(envs.BCRYPT_SALT),
  );

  user!.password = hashedPassword;
  await user?.save();
};

const setPasswordService = async (userId: string, password: string) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError(httpStatusCode.NOT_FOUND, "User not found");

  if (
    user.password &&
    user.auths.some((auth) => auth.provider === "Creadentials")
  ) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      `You have already setup your password. 
            Please go to your plofile and change your password`,
    );
  }

  const newAuths: IAuthProvider = {
    provider: "Creadentials",
    providerId: user.email,
  };

  const userAuths: IAuthProvider[] = [newAuths, ...user.auths];

  const hashedPassword = await bcrypt.hash(password, Number(envs.BCRYPT_SALT));

  user.password = hashedPassword;
  user.auths = userAuths;

  await user.save();
};

const forgotPasswordService = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "User does not exist");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      "User is not verified",
      CUSTOM_ERROR.USER_NOT_VERIFIED,
    );
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      `User is ${isUserExist.isActive}`,
      isUserExist.isActive === IsActive.BLOCKED
        ? CUSTOM_ERROR.USER_BLOCKED
        : CUSTOM_ERROR.USER_INACTIVE,
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "User is deleted");
  }

  const jwtPayload = {
    id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(jwtPayload, envs.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envs.FRONTEND_URL}/auth/forgot-password/reset?token=${resetToken}`;

  await sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgotPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};

const resetPasswordService = async (payload: Record<string, any>) => {
  const token = payload.token;
  const tokenPayload = jwt.verify(
    token,
    envs.JWT_ACCESS_TOKEN_SECRET,
  ) as JwtPayload;

  const isUserExist = await User.findById(tokenPayload.id);

  if (!isUserExist) {
    throw new AppError(401, "User does not exist");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(envs.BCRYPT_SALT),
  );

  isUserExist.password = hashedPassword;

  await isUserExist.save();
};

export const authServices = {
  authLoginService,
  getAccessTokenService,
  changePasswordService,
  setPasswordService,
  forgotPasswordService,
  resetPasswordService,
};
