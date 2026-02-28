import AppError from "../../errorHelpers/appError";
import httpStatusCode from "http-status-codes";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { QueryBuilder } from "../../utils/queryBuilder";
import { deleteCloudinaryImage } from "../../config/cloudinary";
import { tourSearchableFields } from "../../utils/constants";

// create tourType service
const createTourTypeService = async (payload: Partial<ITourType>) => {
  const isExistTourType = await TourType.findOne({ name: payload.name });

  if (isExistTourType) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "TourType Already Exist.");
  }

  const tourType = await TourType.create(payload);

  return tourType;
};

// get all tourTypes service
const getAllTourTypeService = async () => {
  const tourTypes = await TourType.find({});
  const totalTourTypes = await TourType.countDocuments();

  return {
    data: tourTypes,
    meta: { totalTourTypes },
  };
};

// get single tourType service
const getSingleTourTypeService = async (tourTypeId: string) => {
  const tourType = await TourType.findById(tourTypeId);
  return tourType;
};

// update tourType service
const updateTourTypeService = async (
  tourTypeId: string,
  payload: Partial<ITourType>,
) => {
  const tourType = await TourType.findById(tourTypeId);
  if (!tourType) {
    throw new AppError(httpStatusCode.NOT_FOUND, "TourType not found");
  }

  const updateTourType = await TourType.findByIdAndUpdate(tourTypeId, payload, {
    new: true,
    runValidators: true,
  });

  return updateTourType;
};

// delete tourType service
const deleteTourTypeService = async (tourTypeId: string) => {
  await TourType.findByIdAndDelete(tourTypeId);
};

export const tourTypeServices = {
  createTourTypeService,
  getAllTourTypeService,
  getSingleTourTypeService,
  updateTourTypeService,
  deleteTourTypeService,
};

// create tour service
const createTourService = async (payload: Partial<ITour>) => {
  console.log(payload);
  const isExistTour = await Tour.findOne({ title: payload.title });
  if (isExistTour) {
    throw new AppError(httpStatusCode.BAD_REQUEST, "Tour Already Exist.");
  }
  await Tour.create({ ...payload, availableGuest: payload.maxGuest });
};

// get all tours  service
const getAllToursService = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Tour.find()
      .populate("tourType", "_id name")
      .populate("division", "_id name"),
    query,
  );
  const tours = await queryBuilder
    .search(["title", "description", "location"])
    .filter()
    .sort()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    tours.getMeta(["title", "description", "location"]),
  ]);

  return {
    data,
    meta,
  };
};

// get single tour service
const getSingleTourService = async (tourId: string) => {
  const tour = await Tour.findById(tourId)
    .populate("tourType", "name")
    .populate("division", "name");
  return tour;
};

// update tour service
const updateTourService = async (tourId: string, payload: Partial<ITour>) => {
  const tour = await Tour.findById(tourId);
  if (!tour) {
    throw new AppError(httpStatusCode.NOT_FOUND, "Tour not found");
  }

  if (
    payload.images &&
    payload.images.length > 0 &&
    tour.images &&
    tour.images.length > 0
  ) {
    payload.images = [...payload.images, ...tour.images];
  }

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    tour.images &&
    tour.images.length > 0
  ) {
    const restDBImages = tour.images.filter(
      (imageUrl) => !payload.deleteImages?.includes(imageUrl),
    );

    const updatedPayloadImages = (payload.images || [])
      .filter((imageUrl) => !payload.deleteImages?.includes(imageUrl))
      .filter((imageUrl) => !restDBImages.includes(imageUrl));

    payload.images = [...restDBImages, ...updatedPayloadImages];
  }

  const updateTour = await Tour.findByIdAndUpdate(tourId, payload, {
    new: true,
    runValidators: true,
  });

  if (typeof payload.deleteImages === "string") {
    payload.deleteImages = JSON.parse(payload.deleteImages);
  }
  if (payload.deleteImages && payload.deleteImages.length > 0) {
    await Promise.all(
      payload.deleteImages.map((url) => deleteCloudinaryImage(url)),
    );
  }

  return updateTour;
};

// delete tour service
const deleteTourService = async (tourId: string) => {
  const tour = await Tour.findByIdAndDelete(tourId);
  if (tour?.images && tour.images.length > 0) {
    await Promise.all(
      tour.images.map((url) => deleteCloudinaryImage(url)),
    );
  }
};

export const tourServices = {
  createTourService,
  getAllToursService,
  getSingleTourService,
  updateTourService,
  deleteTourService,
};
