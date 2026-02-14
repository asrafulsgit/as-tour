import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>({
  tour: {
    type: Schema.Types.ObjectId,
    required: [true, "Tour Id is required"],
    ref: "Tour",
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "User Id is required"],
    ref: "User",
  },
  rating: {
    type: Number,
    required: [true, "Rating Id is required"],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, "Comment Id is required"],
  },
},{timestamps : true, versionKey : false});

export const Review = model<IReview>("Review", reviewSchema);
