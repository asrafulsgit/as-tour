import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes";
import { guideServices } from "./guide.services";
import { IApplyGuide } from "./guide.interface";
import { JwtPayload } from "jsonwebtoken";

// create division controller
const applyGuideController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IApplyGuide = {
      ...req.body,
      nidPhoto: req.file?.path,
    };
    const user = req.user as JwtPayload;

    const data = await guideServices.applyGuideService(
      payload,
      user.id as string,
    );

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Application successfull",
      data,
    });
  },
);

// approve guide application 
const approveGuideApplicationController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    await guideServices.approveGuideService(id);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Application approved",
      data: null
    });
  },
);
// reject guide application 
const rejectGuideApplicationController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    await guideServices.rejectGuideService(id);

    sendResponse(res, {
      statusCode: httpStatusCode.OK,
      success: true,
      message: "Application rejected",
      data: null
    });
  },
);

// get all guide
const getGuidesController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query
    const guides = await guideServices.getAllGuidesService(query as Record<string, string>);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Guides retrieved successfully",
      data: guides 
    });
  },
);
// get signle guide 
const getSingleGuideController = asyncHandler(async(req : Request, res : Response,next : NextFunction)=>{
     const id = req.params.id as string;
    const results = await guideServices.getSingleGuideService(id);

    sendResponse(res,{
        statusCode : httpStatusCode.OK,
        success : true,
        message : 'Guide retrived',
        data : results
    });
});
export const guideControllers = {
  applyGuideController,
  approveGuideApplicationController,
  rejectGuideApplicationController,
  getGuidesController,
  getSingleGuideController
};
