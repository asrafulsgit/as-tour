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

    const review = await Review.create([{ ...payload, user: userId }], {
      session,
    });
    const tourId = review[0].tour;
    const stats = await Review.aggregate([
      { $match: { tour: tourId } },
      {
        $group: {
          _id: "$tour",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]).session(session);
    await Tour.findByIdAndUpdate(
      payload.tour,
      {
        rating: stats[0]?.avgRating || 0,
        reviews: stats[0]?.totalReviews || 0,
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
    const tourId = review.tour;

    await Review.findByIdAndDelete(reviewId, { session });

    const stats = await Review.aggregate([
      { $match: { tour: tourId } },
      {
        $group: {
          _id: "$tour",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]).session(session);
    
    await Tour.findByIdAndUpdate(
      tourId,
      {
        rating: stats[0]?.avgRating || 0,
        reviews: stats[0]?.totalReviews || 0,
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
