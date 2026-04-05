import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatusCode from "http-status-codes";
import { envs } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs"; 
import { deleteCloudinaryImage } from "../../config/cloudinary";
import { Booking } from "../booking/booking.model";
import mongoose from "mongoose";
import { Payment } from "../payment/payment.model";
import { QueryBuilder } from "../../utils/queryBuilder";

const userCreateService = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "User Already Exist.");
  }

  const hashPassword = await bcrypt.hash(
    password as string,
    Number(envs.BCRYPT_SALT),
  );

  const authProvider: IAuthProvider = {
    provider: "Creadentials",
    providerId: email as string,
  };
  await User.create({
    email,
    password: hashPassword,
    auths: [authProvider],
    ...rest,
  });
};

const userUpdateService = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  if (
    userId !== decodedToken.id &&
    decodedToken.role !== Role.ADMIN &&
    decodedToken.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(
      httpStatusCode.BAD_GATEWAY,
      "You cannot modify someone else's data.",
    ); 
  }
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatusCode.NOT_FOUND, "User not found");
  }
  if (payload.role) {
    if (decodedToken.role === Role.GUIDE || decodedToken.role === Role.USER) {
      throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.GUIDE || decodedToken.role === Role.USER) {
      throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, envs.BCRYPT_SALT);
  }

  const existingPicture = isUserExist.picture;

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  if (
    payload.picture &&
    existingPicture &&
    payload.picture !== existingPicture
  ) {
    await deleteCloudinaryImage(existingPicture);
  }

  return updatedUser;
};

const getAllUserService = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find().select("-password"), query);
  const users = await queryBuilder
    .search(["name", "email", "address", "phone"])
    .filter()
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    users.build(),
    users.getMeta(["name", "email", "address", "phone"]),
  ]);

  return {
    data,
    meta,
  };
};
const getUserService = async (user: JwtPayload) => {
  const userData = await User.findById(user.id).select("-password");
  return userData;
};

const getUserDetailsService = async (user: string) => {
  const userData = await User.findById(user).select("-password");
  return userData;
};

const getUserBookingStatsService = async (userId: string) => {
  const objectUserId = new mongoose.Types.ObjectId(userId);

  const [bookingStats, paymentStats] = await Promise.all([
    Booking.aggregate([
      {
        $match: { user: objectUserId },
      },
      {
        $group: {
          _id: null,
          totalBooking: { $sum: 1 },
          pendingBooking: {
            $sum: {
              $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0],
            },
          },
          confirmBooking: {
            $sum: {
              $cond: [{ $eq: ["$status", "COMPLETE"] }, 1, 0],
            },
          },
        },
      },
    ]),

    Payment.aggregate([
      {
        $match: { status: "PAID" },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "booking",
          foreignField: "_id",
          pipeline: [
            {
              $match: { user: objectUserId },
            },
          ],
          as: "booking",
        },
      },
      {
        $match: { booking: { $ne: [] } },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  return {
    totalBooking: bookingStats[0]?.totalBooking || 0,
    pendingBooking: bookingStats[0]?.pendingBooking || 0,
    confirmBooking: bookingStats[0]?.confirmBooking || 0,
    totalSpent: paymentStats[0]?.totalSpent || 0,
  };
};

export const userServices = {
  userCreateService,
  userUpdateService,
  getAllUserService,
  getUserService,
  getUserBookingStatsService,
  getUserDetailsService,
};
