import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { ISSlCommerz } from "../sslCommerz/ssl.interface";
import { sslCommerzServices } from "../sslCommerz/ssl.services";
import httpStatusCode from "http-status-codes";
import mongoose from "mongoose";
import { QueryBuilder } from "../../utils/queryBuilder";

const generateTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// create booking service
const createBookingService = async (
  payload: Partial<IBooking>,
  userId: string,
) => {
  if (!payload.guests || Number(payload.guests) < 1) {
    throw new AppError(httpStatus.BAD_REQUEST, "At least 1 guest is required.");
  }

  const requestedGuests = Number(payload.guests);

  const tran_id = generateTransactionId();
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Please update your profile (phone & address) before booking a tour.",
      );
    }

    const tour = await Tour.findById(payload.tour).select(
      "costFrom maxGuest startDate",
    );

    if (!tour) {
      throw new AppError(httpStatus.NOT_FOUND, "Tour not found.");
    }
    if (!tour?.costFrom || !tour.maxGuest) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Tour pricing is not configured. Please contact support.",
      );
    }

    const now = new Date();

    if (tour.startDate && tour.startDate < now) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cannot book a tour for a past date.",
      );
    }

    const existingBookingsAgg = await Booking.aggregate([
      {
        $match: {
          tour: new mongoose.Types.ObjectId(tour._id),
          status: { $in: [BOOKING_STATUS.COMPLETE, BOOKING_STATUS.PENDING] },
        },
      },
      {
        $group: {
          _id: null,
          totalGuests: { $sum: "$guests" },
        },
      },
    ]);

    const alreadyBookedGuests: number =
      existingBookingsAgg[0]?.totalGuests ?? 0;
    const availableSlots = tour.maxGuest - alreadyBookedGuests;
    if (availableSlots <= 0) {
      throw new AppError(
        httpStatus.CONFLICT,
        "This tour is fully booked. No guest slots remaining.",
      );
    }
    if (requestedGuests > availableSlots) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Only ${availableSlots} guest slot(s) remaining for this tour. You requested ${requestedGuests}.`,
      );
    }

    const duplicateBooking = await Booking.findOne({
      user: userId,
      tour: payload.tour,
      status: BOOKING_STATUS.PENDING,
    });

    if (duplicateBooking) {
      throw new AppError(
        httpStatus.CONFLICT,
        "You already have a pending booking for this tour. Please complete the pending booking before creating a new one.",
      );
    }

    const amount = Number(tour.costFrom) * Number(payload.guests!);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const booking = await Booking.create(
      [
        {
          user: userId,
          guests: requestedGuests,
          status: BOOKING_STATUS.PENDING,
          expiresAt,
          ...payload,
        },
      ],
      { session },
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: tran_id,
          amount: amount,
        },
      ],
      { session },
    );

    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      { payment: payment[0]._id },
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    const userAddress = (updatedBooking?.user as any).address;
    const userEmail = (updatedBooking?.user as any).email;
    const userPhoneNumber = (updatedBooking?.user as any).phone;
    const userName = (updatedBooking?.user as any).name;

    const sslPayload: ISSlCommerz = {
      address: userAddress,
      email: userEmail,
      phone: userPhoneNumber,
      name: userName,
      amount: amount,
      transactionId: tran_id,
    };

    const sslPayment =
      await sslCommerzServices.sslCommerzInitializeService(sslPayload);

    if (!sslPayment?.GatewayPageURL) {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        "Payment gateway initialization failed. Please try again.",
      );
    }

    await session.commitTransaction();
    session.endSession();
    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// get all bookings  service
const getAllBookingsService = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Booking.find().populate("tour", "title").populate("payment", "amount"),
    query,
  );
  const bookings = await queryBuilder.search([]).filter().sort().paginate();

  const [data, meta] = await Promise.all([
    bookings.build(),
    bookings.getMeta([]),
  ]);

  return {
    data,
    meta,
  };
};

// get my bookings  service
const getUserBookingsService = async (userId: string) => {
  const bookings = await Booking.find({ user: userId })
    .populate("tour", "images title startDate endDate")
    .populate("payment", "amount");
  return bookings;
};

// get single booking service
const getBookingByIdService = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId)
    .populate("user", "name email picture")
    .populate("tour", "title images startDate endDate maxGuest")
    .populate("payment", "amount status");
  return booking;
};

// update booking service
const updateBookingStatusService = async (
  bookingId: string,
  status: BOOKING_STATUS,
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(httpStatusCode.NOT_FOUND, "Booking not found");
  }

  const updateTour = await Booking.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true, runValidators: true },
  );

  return updateTour;
};

export const bookingServices = {
  createBookingService,
  getAllBookingsService,
  getUserBookingsService,
  getBookingByIdService,
  updateBookingStatusService,
};
