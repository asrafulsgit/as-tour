import { model, Schema } from "mongoose";
import { IBlog } from "./blog.interface";

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: [true, "Createtor is required"],
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false },
);

export const Blog = model<IBlog>("Blog", blogSchema);
