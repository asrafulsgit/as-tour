import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from 'http-status-codes';
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";


const  generateTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

// create booking service
const createBookingService =async(payload : Partial<IBooking>,userId : string)=>{

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
            transactionId: generateTransactionId(),
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

        await session.commitTransaction();
        session.endSession();
        return updatedBooking;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

// // get all tours  service
// const getAllToursService =async(query : Record<string,string>)=>{
     
//      const queryBuilder = new QueryBuilder(Tour.find(), query)

//     const tours = await queryBuilder
//         .search()
//         .filter()
//         .sort()
//         .paginate();
 
    
//     const [data,meta]= await Promise.all([
//         tours.build(),
//         tours.getMeta()
//     ])
    
//     return {
//          data,
//          meta 
//     };

// }

// // get single tour service
// const getSingleTourService =async(tourId : string)=>{
//     const tour = await Tour.findById(tourId)
//     .populate('tourType',"name")
//     .populate('division',"name");
//     return tour;
// }

// // update tour service
// const updateTourService =async(tourId : string, payload : Partial<ITour>)=>{
//     const tour = await Tour.findById(tourId);
//     if(!tour){
//         throw new AppError(httpStatusCode.NOT_FOUND,"Tour not found");
//     }

//     const updateTour = await Tour.findByIdAndUpdate(tourId,
//         payload,{new : true, runValidators : true});
    
//     return updateTour;
// }

// // delete tour service
// const deleteTourService =async(tourId : string)=>{
//      await Tour.findByIdAndDelete(tourId);
// }


export const bookingServices ={
    createBookingService
}