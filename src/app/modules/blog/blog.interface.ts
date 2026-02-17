import { Types } from "mongoose";

export interface IBlog {
  title: string;
  thumbnail : string;
  description: string;
  type: string;
  createdBy: Types.ObjectId;
}
