import crypto from "crypto";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/appError";
import httpStatusCode from "http-status-codes";
import { redisClient } from "../../config/redis";
import { sendEmail } from "../../utils/sendMail";

const OTPExpiresIn = 2 * 60;
const OTPGenerator = (lenth = 6) => {
  const OTP = crypto.randomInt(10 ** (lenth - 1), 10 ** lenth).toString();
  return OTP;
};

const OTPSendService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "You are already verified");
  }

  const otp = OTPGenerator(); 
  await redisClient.set(`otp:${user.email}`, otp, {
    expiration: {
      type: "EX",
      value: OTPExpiresIn,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Email verification OTP",
    templateName: "otp",
    templateData: {
      name: user.name,
      otp: otp,
    },
  });
};

const OPTVerifyService = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatusCode.NOT_FOUND, "User not found");
  }

  if (user.isVerified) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "You are already verified");
  }

  const redisKey = `otp:${email}`;

  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "Invalid OTP");
  }

  if (savedOtp !== otp) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "Invalid OTP");
  }

  await Promise.all([
    User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { runValidators: true },
    ),
    redisClient.del([redisKey]),
  ]);
};

export const OTPServices = {
  OTPSendService,
  OPTVerifyService,
};
