import { Types } from "mongoose";

export interface IReview {
  tour: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
}
