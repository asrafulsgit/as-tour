import { NextFunction, Request, Response } from "express";
import httpStatusCode from "http-status-codes";
import { blogServices } from "./blog.services";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { IBlog } from "./blog.interface";

const createBlogController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload;
    const payload: IBlog = {
      ...req.body,
      createdBy: user.id,
      thumbnail: req.file?.path,
    };
    await blogServices.createBlogService(payload);

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: "Blog created",
      data: null,
    });
  },
);

const getSingleBlogController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.id;
    const results = await blogServices.getSingleBlogService(blogId);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Blog retrived",
      data: results,
    });
  },
);

const getAllBlogsController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const results = await blogServices.getAllBlogsService(
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Blogs retrived",
      data: results.data,
      meta: results.meta,
    });
  },
);

const updateBlogController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = req.params.id;
    const image = req.file?.path;
    const user = req.user as JwtPayload;

    const payload: Partial<IBlog> = {
      ...req.body,
      thumbnail: image,
    };
    const results = await blogServices.updateBlogService(
      blogId,
      payload,
      user.id,
    );

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Blog updated",
      data: results,
    });
  },
);

const deleteBlogController = asyncHandler(
  async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const user = req.user as JwtPayload;
    await blogServices.deleteBlogService(blogId, user.id);
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Blog deleted",
      data: null,
    });
  },
);

export const blogControllers = {
  createBlogController,
  getSingleBlogController,
  getAllBlogsController,
  updateBlogController,
  deleteBlogController,
};
