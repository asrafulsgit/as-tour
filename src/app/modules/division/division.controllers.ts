import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes";
import { divisionServices } from "./division.services";
import { IDivision } from "./division.interface";

// create division controller
const createDivisionController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IDivision = {
      ...req.body,
      thumbnail: req.file?.path,
    };

    await divisionServices.createDivisionService(payload);

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: "Division created",
      data : null,
    });
  },
);

// get all divisions controller
const getAllDivisionsController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const results = await divisionServices.getAllDivisionsService();

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Divisions retrived",
      data: results.data,
      meta: { total: results.meta.totalDivisions },
    });
  },
);

// get all divisions tour count controller
const getAllDivisionsTourCountController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const results = await divisionServices.getAllDivisionsTourCountService();

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Divisions tour count retrived",
      data: results,
    });
  },
);

// get signle division controller
const getSingleDivisionController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const results = await divisionServices.getSingleDivisionService(id);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Division retrived",
      data: results,
    });
  },
);

// update division controller
const updateDivisionController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisionId = req.params.id as string;
    const image = req.file?.path;

    const payload: Partial<IDivision> = {
      ...req.body,
      thumbnail: image,
    };
    await divisionServices.updateDivisionService(
      divisionId,
      payload,
    );

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Division updated",
      data: null
    });
  },
);

// delete division controller
const deleteDivisionController = asyncHandler(
  async (req: Request, res: Response) => {
    const divisionId = req.params.id as string;
    await divisionServices.deleteDivisionService(divisionId);
    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Division deleted",
      data: null,
    });
  },
);

export const divisionControllers = {
  createDivisionController,
  getAllDivisionsController,
  getAllDivisionsTourCountController,
  getSingleDivisionController,
  updateDivisionController,
  deleteDivisionController,
};
