import mongoose from "mongoose";
import AppError from "../../errorHelpers/appError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IBlog } from "./blog.interface";
import { Blog } from "./blog.model";
import httpStatusCode from "http-status-codes";
import { deleteCloudinaryImage } from "../../config/cloudinary";

const createBlogService = async (payload: IBlog) => {
  await Blog.create(payload);
};

const getSingleBlogService = async (blogId: string) => {
  const blog = await Blog.findById(blogId).populate(
    "createdBy",
    "_id name picture",
  );
  return blog;
};

const getAllBlogsService = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Blog.find(), query);
  const blogs = await queryBuilder
    .search(["title", "description"])
    .filter()
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    blogs.build(),
    blogs.getMeta(["title", "description"]),
  ]);

  return {
    data,
    meta,
  };
};

const updateBlogService = async (
  blogId: string,
  payload: Partial<IBlog>,
  userId: string,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingBlog = await Blog.findById(blogId).session(session);

    if (!existingBlog) {
      throw new AppError(httpStatusCode.NOT_FOUND, "Blog not found");
    }

    if (userId && existingBlog.createdBy.toString() !== userId) {
      throw new AppError(
        httpStatusCode.FORBIDDEN,
        "You are not authorized to update this blog",
      );
    }

    const previousThumbnail = existingBlog.thumbnail;

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, payload, {
      new: true,
      runValidators: true,
      session,
    });

    if (!updatedBlog) {
      throw new AppError(
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to update blog",
      );
    }

    await session.commitTransaction();
    session.endSession();

    if (
      previousThumbnail &&
      payload.thumbnail &&
      previousThumbnail !== payload.thumbnail
    ) {
      await deleteCloudinaryImage(previousThumbnail);
    }

    return updatedBlog;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const deleteBlogService = async (blogId: string, userId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingBlog = await Blog.findById(blogId).session(session);

    if (!existingBlog) {
      throw new AppError(httpStatusCode.NOT_FOUND, "Blog not found");
    }

    if (userId && existingBlog.createdBy.toString() !== userId) {
      throw new AppError(
        httpStatusCode.FORBIDDEN,
        "You are not authorized to delete this blog",
      );
    }

    const thumbnailToDelete = existingBlog.thumbnail;

    await Blog.findByIdAndDelete(blogId, { session });

    await session.commitTransaction();
    session.endSession();

    if (thumbnailToDelete) {
      await deleteCloudinaryImage(thumbnailToDelete);
    }

    return null;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const blogServices = {
  createBlogService,
  getSingleBlogService,
  getAllBlogsService,
  updateBlogService,
  deleteBlogService,
};
