import { uploadBufferToCloudinary } from "../../config/cloudinary";
import AppError from "../../errorHelpers/appError";
import { generatePdf, IInvoiceData } from "../../utils/invoiceGenerator";
import { sendEmail } from "../../utils/sendMail";
import { BOOKING_STATUS, IBooking } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSlCommerz } from "../sslCommerz/ssl.interface";
import { sslCommerzServices } from "../sslCommerz/ssl.services";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
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
         const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID,
        }, { new: true, runValidators: true, session: session })

        if (!updatedPayment) {
            throw new AppError(401, "Payment not found")
        }

        const updatedBooking = await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                { new: true, runValidators: true, session }
            )
            .populate("tour", "title")
            .populate("user", "name email")

        if (!updatedBooking) {
            throw new AppError(401, "Booking not found")
        }

        const invoiceData: IInvoiceData = {
            bookingDate: updatedBooking.createdAt as Date,
            guestCount: updatedBooking.guests,
            totalAmount: updatedPayment.amount,
            tourTitle: (updatedBooking.tour as unknown as ITour).title,
            transactionId: updatedPayment.transactionId,
            userName: (updatedBooking.user as unknown as IUser).name
        }

        const pdfBuffer = await generatePdf(invoiceData)

        const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice")

        if (!cloudinaryResult) {
            throw new AppError(401, "Error uploading pdf")
        }

        await Payment.findByIdAndUpdate(updatedPayment._id, 
            { invoiceUrl: cloudinaryResult.secure_url }, 
            { runValidators: true, session });

        await sendEmail({
            to: (updatedBooking.user as unknown as IUser).email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            templateData: {
                name : (updatedBooking.user as unknown as IUser).name
            },
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        })

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
// get payment invoice 
const getInvoiceService = async (paymentId: string , userId : string) => {
    const payment = await Payment.findById(paymentId)
        .populate('booking');

    if(String(userId) !== String((payment?.booking as unknown as IBooking).user)){
        throw new AppError(httpStatus.BAD_REQUEST, "You are not allow to get invoice")
    }

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found")
    }

    if (!payment.invoiceUrl) {
        throw new AppError(httpStatus.NOT_FOUND, "No invoice found")
    }

    return payment.invoiceUrl;
};


export const paymentServices ={
    paymentSuccessService,
    paymentFailService,
    paymentCancelService,
    initPaymentService,
    getInvoiceService
}