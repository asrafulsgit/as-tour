import mongoose from "mongoose";
import { deleteCloudinaryImage } from "../../config/cloudinary";
import AppError from "../../errorHelpers/appError";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatusCode from "http-status-codes";

// create division service
const createDivisionService = async (payload: Partial<IDivision>) => {
  const isExistDivision = await Division.findOne({ name: payload.name });

  if (isExistDivision) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "Division Already Exist.");
  }

  const division = await Division.create(payload);
  return division;
};

// get all divisions service
const getAllDivisionsService = async () => {
  const divisions = await Division.find({});
  const totalDivisions = await Division.countDocuments();

  return {
    data: divisions,
    meta: { totalDivisions },
  };
};

// get all divisions tour count service
const getAllDivisionsTourCountService = async () => {
  const result = await Division.aggregate([
    {
      $lookup: {
        from: "tours", // collection name (usually plural & lowercase)
        localField: "_id",
        foreignField: "division",
        as: "tours",
      },
    },
    {
      $addFields: {
        tourCount: { $size: "$tours" },
      },
    },
    {
      $project: {
        tours: 0,
      },
    },
  ]);

  return result;
};

// get single division service
const getSingleDivisionService = async (id: string) => {
  const division = await Division.findById(id);
  if (!division) {
    throw new AppError(httpStatusCode.NOT_FOUND, "Division not found");
  }
  return division;
};

// update division service
const updateDivisionService = async (
  divisionId: string,
  payload: Partial<IDivision>,
) => {
  const existingDivision = await Division.findById(divisionId);

  if (!existingDivision) {
    throw new AppError(httpStatusCode.NOT_FOUND, "Division not found");
  }

  if (payload.name && payload.name !== existingDivision.name) {
    const duplicate = await Division.findOne({
      name: payload.name,
      _id: { $ne: divisionId },
    });

    if (duplicate) {
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        "A division with this name already exists",
      );
    }
  }

  const previousThumbnail = existingDivision.thumbnail;

  const updatedDivision = await Division.findByIdAndUpdate(
    divisionId,
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedDivision) {
    throw new AppError(
      httpStatusCode.INTERNAL_SERVER_ERROR,
      "Failed to update division",
    );
  }
  if (
    previousThumbnail &&
    payload.thumbnail &&
    previousThumbnail !== payload.thumbnail
  ) {
    await deleteCloudinaryImage(previousThumbnail);
  }

  return updatedDivision;
};

// delete division service
const deleteDivisionService = async (divisionId: string) => {
  const existingDivision = await Division.findById(divisionId);

  if (!existingDivision) {
    throw new AppError(httpStatusCode.NOT_FOUND, "Division not found");
  }

  const thumbnailToDelete = existingDivision.thumbnail;

  await Division.findByIdAndDelete(divisionId);

  if (thumbnailToDelete) {
    await deleteCloudinaryImage(thumbnailToDelete);
  }

  return null;
};

export const divisionServices = {
  createDivisionService,
  getAllDivisionsService,
  getAllDivisionsTourCountService,
  getSingleDivisionService,
  updateDivisionService,
  deleteDivisionService,
};
