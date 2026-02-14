import AppError from "../../errorHelpers/appError";
import { IReview } from "./review.interface";
import { Review } from "./review.model";
import httpStatusCode from "http-status-codes";

// create review service
const createReviewService = async (payload: IReview, userId: string) => {
  const isExistReview = await Review.findOne({
    tour: payload.tour,
    user: userId,
  });

  if (isExistReview) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      "You’ve already posted a review for this tour.",
    );
  }

  await Review.create({
    ...payload,
    user: userId,
  });
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
  await Review.findByIdAndDelete(reviewId);
};

export const reviewServices = {
  createReviewService,
  getAllReviewsService,
  deleteReviewService,
};
