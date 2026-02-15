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
const getSingleDivisionService = async (slug: string) => {
  const division = await Division.findOne({ slug });
  return division;
};

// update division service
const updateDivisionService = async (
  divisionId: string,
  payload: Partial<IDivision>,
) => {
  const division = await Division.findById(divisionId);

  if (!division) {
    throw new AppError(httpStatusCode.NOT_FOUND, "Division not found");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: divisionId },
  });

  if (duplicateDivision) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      "A division with this name already exist",
    );
  }

  const updatedDivision = await Division.findByIdAndUpdate(
    divisionId,
    payload,
    { new: true, runValidators: true },
  );

  // delete previous thumbnail from cloudinay
  if (division.thumbnail && updatedDivision?.thumbnail) {
    await deleteCloudinaryImage(division.thumbnail);
  }

  return updatedDivision;
};

// delete division service
const deleteDivisionService = async (divisionId: string) => {
  await Division.findByIdAndDelete(divisionId);
};

export const divisionServices = {
  createDivisionService,
  getAllDivisionsService,
  getAllDivisionsTourCountService,
  getSingleDivisionService,
  updateDivisionService,
  deleteDivisionService,
};
