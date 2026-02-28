import mongoose from "mongoose";
import AppError from "../../errorHelpers/appError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { GuideApplicationStatus, IApplyGuide } from "./guide.interface";
import { GuideApplication } from "./guide.model";
import httpStatusCode from "http-status-codes";

// guide application service
const applyGuideService = async (
  payload: Partial<IApplyGuide>,
  userId: string,
) => {
  const user = await User.findById(userId);

  if(!user?.phone || !user?.address){
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      "Please update your profile (phone & address) before application.",
    );
  }

  const isExistApplication = await GuideApplication.findOne({ userId });

  if (isExistApplication?.status === GuideApplicationStatus.PENDING) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      "An existing application is already in progress.",
    );
  }
  if (isExistApplication?.status === GuideApplicationStatus.APPROVED) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      "Your Application is approved.",
    );
  }

  const newDpplication = await GuideApplication.create({
    userId,
    divisionId: payload.divisionId,
    nidPhotos: payload.nidPhotos,
  });
  return newDpplication;
};

// guide application approve service
const approveGuideService = async (applicationId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const application =
      await GuideApplication.findById(applicationId).session(session);
    if (!application) {
      throw new AppError(httpStatusCode.BAD_REQUEST, "Application not found.");
    }
    if (application?.status !== GuideApplicationStatus.PENDING) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        `Application ${application.status}.`,
      );
    }

    application.status = GuideApplicationStatus.APPROVED;
    await application.save({ session });

    const userId = application?.userId;

    const userUpdateResult = await User.findByIdAndUpdate(
      userId,
      {
        role: Role.GUIDE,
      },
      { new: true, runValidators: true, session },
    );

    if (!userUpdateResult) {
      throw new AppError(httpStatusCode.BAD_REQUEST, "User not found.");
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// guide application reject service
const rejectGuideService = async (applicationId: string) => {
  const application = await GuideApplication.findById(applicationId);
  if (!application) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "Application not found.");
  }
  if (application?.status !== GuideApplicationStatus.PENDING) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      `Application ${application.status}.`,
    );
  }

  application.status = GuideApplicationStatus.REJECTED;
  await application.save();
};

// get guides service
const getAllGuidesService = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    GuideApplication.find()
      .populate("userId", "name email phone address")
      .populate("divisionId", "name"),
    query,
  );

  const guides = await queryBuilder.filter().sort().fields().paginate();

  const [data, meta] = await Promise.all([
    guides.build(),
    queryBuilder.getMeta([]),
  ]);

  return {
    data,
    meta,
  };
};

// get single guide
const getSingleGuideService = async (id: string) => {
  const guide = await GuideApplication.findById(id)
    .populate("userId", "name email phone address")
    .populate("divisionId", "name");
  if (!guide) {
    throw new AppError(httpStatusCode.NOT_FOUND, `Application not found.`);
  }
  return guide;
};

// get guide applications
const getGuideApplicationsService = async (userId: string) => {
  const applications = await GuideApplication.find({
    userId,
  })
    .sort("status")
    .populate("divisionId", "name");
  return applications;
};

export const guideServices = {
  applyGuideService,
  approveGuideService,
  rejectGuideService,
  getAllGuidesService,
  getSingleGuideService,
  getGuideApplicationsService,
};
