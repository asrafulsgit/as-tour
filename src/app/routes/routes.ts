import { Router } from "express";
import { userRouter } from "../modules/user/user.router";
import { authRouter } from "../modules/auth/auth.router";
import { divisionRouter } from "../modules/division/division.router";
import { tourRouter } from "../modules/tour/tour.router";
import { bookingRouter } from "../modules/booking/booking.router";
import { paymentRouter } from "../modules/payment/payment.router";
import { otpRouter } from "../modules/otp/otp.router";

export const router  = Router();


const routes = [
    {
        path : '/user',
        route : userRouter
    },
    {
        path : '/auth',
        route : authRouter
    },
    {
        path : '/division',
        route : divisionRouter
    },
    {
        path : '/tour',
        route : tourRouter
    },
    {
        path : '/booking',
        route : bookingRouter
    },
    {
        path : '/payment',
        route : paymentRouter
    },
    {
        path : '/otp',
        route : otpRouter
    }
]


routes.forEach((route)=>{
    router.use(route.path, route.route);
})


