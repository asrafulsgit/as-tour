import AppError from "../../errorHelpers/appError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSlCommerz } from "../sslCommerz/ssl.interface";
import { sslCommerzServices } from "../sslCommerz/ssl.services";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";

// re payment service 
const initPaymentService = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId })

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    }

    const booking = await Booking.findById(payment.booking)

    const userAddress = (booking?.user as any).address;
    const userEmail = (booking?.user as any).email;
    const userPhoneNumber = (booking?.user as any).phone;
    const userName = (booking?.user as any).name;

    const sslPayload: ISSlCommerz = {
        address: userAddress,
        email: userEmail,
        phone: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await sslCommerzServices.sslCommerzInitializeService(sslPayload)

    return {
        paymentUrl: sslPayment.GatewayPageURL
    }

};

// payment success service
const paymentSuccessService =async(query : Record<string,string>)=>{
    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatePayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID,
        }, {runValidators: true, session })

        await Booking
            .findByIdAndUpdate(
                updatePayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                {runValidators: true, session }
            )

        await session.commitTransaction();  
        session.endSession()
        return { success: true, message: "Payment Completed Successfully" }
    } catch (error) {
        await session.abortTransaction();   
        session.endSession();
        throw error;
    }
}
// payment fail service
const paymentFailService =async(query : Record<string,string>)=>{
    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatePayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.FAILED,
        }, {runValidators: true, session })

        await Booking
            .findByIdAndUpdate(
                updatePayment?.booking,
                { status: BOOKING_STATUS.FAILED },
                {runValidators: true, session }
            )

        await session.commitTransaction();  
        session.endSession()
        return { success: false, message: "Payment failed" }
    } catch (error) {
        await session.abortTransaction();   
        session.endSession();
        throw error;
    }
}
// payment cancel service
const paymentCancelService =async(query : Record<string,string>)=>{
    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatePayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCELLED,
        }, {runValidators: true, session })

        await Booking
            .findByIdAndUpdate(
                updatePayment?.booking,
                { status: BOOKING_STATUS.CANCEL },
                {runValidators: true, session }
            )

        await session.commitTransaction();  
        session.endSession()
        return { success: false, message: "Payment cancelled" }
    } catch (error) {
        await session.abortTransaction();   
        session.endSession();
        throw error;
    }
}


export const paymentServices ={
    paymentSuccessService,
    paymentFailService,
    paymentCancelService,
    initPaymentService
}