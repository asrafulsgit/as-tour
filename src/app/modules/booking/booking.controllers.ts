import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes";
import { bookingServices } from "./booking.services";
import { JwtPayload } from "jsonwebtoken";
import { BOOKING_STATUS } from "./booking.interface";

// create booking controller
const createBookingController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;

    const result = await bookingServices.createBookingService(
      req.body,
      user.id,
    );

    sendResponse(res, {
      statusCode: httpStatusCode.CREATED,
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  },
);

// get my bookings
const getUserBookingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const bookings = await bookingServices.getUserBookingsService(
      user.id as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  },
);

// get single booking
const getSingleBookingController = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const booking = await bookingServices.getBookingByIdService(
      bookingId as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
    });
  },
);

// get all bookings
const getAllBookingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query; 
    const results = await bookingServices.getAllBookingsService(
      query as Record<string, string>,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Bookings retrieved successfully",
      data: results.data,
      meta: results.meta,
    });
  },
);

// update booking
const updateBookingStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const status = req.body.status;
    const updated = await bookingServices.updateBookingStatusService(
      bookingId as string,
      status as BOOKING_STATUS,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Booking Status Updated Successfully",
      data: updated,
    });
  },
);

export const bookingControllers = {
  createBookingController,
  getUserBookingsController,
  getSingleBookingController,
  getAllBookingsController,
  updateBookingStatusController,
};
