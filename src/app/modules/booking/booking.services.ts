import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from 'http-status-codes';
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { ISSlCommerz } from "../sslCommerz/ssl.interface";
import { sslCommerzServices } from "../sslCommerz/ssl.services";
import { QueryBuilder } from "../../utils/queryBuilder";
import httpStatusCode from 'http-status-codes';


const  generateTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

// create booking service
const createBookingService =async(payload : Partial<IBooking>,userId : string)=>{
    const tran_id = generateTransactionId();
    const session = await Booking.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(userId);
     
    if (!user?.phone || !user.address) {
            throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your Profile to Book a Tour.")
        }


     const tour = await Tour.findById(payload.tour).select("costFrom")

        if (!tour?.costFrom) {
            throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found!")
        }

        const amount = Number(tour.costFrom) * Number(payload.guests!)

        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload
        }],{session})
        
        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId: tran_id,
            amount: amount
        }],{session} )

        const updatedBooking = await Booking
            .findByIdAndUpdate(
                booking[0]._id,
                { payment: payment[0]._id },
                { new: true, runValidators: true, session}
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
            transactionId: tran_id
        }

        const sslPayment = await sslCommerzServices.sslCommerzInitializeService(sslPayload)

        await session.commitTransaction();
        session.endSession();
        return {
            paymentUrl : sslPayment.GatewayPageURL,
            booking : updatedBooking
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

// get all bookings  service
const getAllBookingsService =async(query : Record<string,string>)=>{
     
    //  const queryBuilder = new QueryBuilder(Booking.find(), query);

    // const bookings = await queryBuilder
    //     .search()
    //     .filter()
    //     .sort()
    //     .paginate();
 
    
    // const [data,meta]= await Promise.all([
    //     bookings.build(),
    //     bookings.getMeta()
    // ]);

   const data = await Booking.find({});
   const totalsBookings = await Booking.countDocuments();
    return {
         data,
         meta : {totalsBookings}
    };

}

// get my bookings  service
const getUserBookingsService =async(userId : string)=>{
    const bookings = await Booking.find({user : userId});
    return bookings 
}

// get single booking service
const getBookingByIdService =async(bookingId : string)=>{
    const booking = await Booking.findById(bookingId).populate('user',"name email picture").populate("tour","title slug")
    return booking;
}

// update booking service
const updateBookingStatusService =async(bookingId : string,status : BOOKING_STATUS)=>{
    const booking = await Booking.findById(bookingId);
    if(!booking){
        throw new AppError(httpStatusCode.NOT_FOUND,"Booking not found");
    }

    const updateTour = await Booking.findByIdAndUpdate(bookingId,
        {status},{new : true, runValidators : true});
    
    return updateTour;
}



export const bookingServices ={
    createBookingService,
    getAllBookingsService,
    getUserBookingsService,
    getBookingByIdService,
    updateBookingStatusService
}