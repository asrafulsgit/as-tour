import mongoose from "mongoose";
import AppError from "../../errorHelpers/appError";
import { Tour } from "../tour/tour.model";
import { IReview } from "./review.interface";
import { Review } from "./review.model";
import httpStatusCode from "http-status-codes";

// create review service
const createReviewService = async (payload: IReview, userId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const isExistReview = await Review.findOne(
      {
        tour: payload.tour,
        user: userId,
      },
      null,
      { session },
    );

    if (isExistReview) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        "You’ve already posted a review for this tour.",
      );
    }

    await Review.create([{ ...payload, user: userId }], { session });
    await Tour.findByIdAndUpdate(
      payload.tour,
      {
        $inc: { reviews: 1 },
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// get all reviews service
const getAllReviewsService = async (tourId: string) => {
  const reviews = await Review.find({ tour: tourId }).populate(
    "user",
    "picture name",
  );
  const totalRevies = await Review.countDocuments();

  return {
    data: reviews,
    meta: { totalRevies },
  };
};

// delete review service
const deleteReviewService = async (reviewId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const review = await Review.findById(reviewId).session(session);

    if (!review) {
      throw new AppError(httpStatusCode.NOT_FOUND, "Review not found.");
    }

    await Review.findByIdAndDelete(reviewId, { session });

    await Tour.findByIdAndUpdate(
      review.tour,
      {
        $inc: { reviews: -1 },
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const reviewServices = {
  createReviewService,
  getAllReviewsService,
  deleteReviewService,
};
