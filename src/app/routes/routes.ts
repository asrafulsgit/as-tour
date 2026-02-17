import { Router } from "express";
import { userRouter } from "../modules/user/user.router";
import { authRouter } from "../modules/auth/auth.router";
import { divisionRouter } from "../modules/division/division.router";
import { tourRouter } from "../modules/tour/tour.router";
import { bookingRouter } from "../modules/booking/booking.router";
import { paymentRouter } from "../modules/payment/payment.router";
import { otpRouter } from "../modules/otp/otp.router";
import { statsRouter } from "../modules/stats/stats.router";
import { guideRouter } from "../modules/guide/guide.router";
import { reviewRouter } from "../modules/review/review.router";
import { contactRouter } from "../modules/contact/contact.router";

export const router = Router();

const routes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/division",
    route: divisionRouter,
  },
  {
    path: "/tour",
    route: tourRouter,
  },
  {
    path: "/booking",
    route: bookingRouter,
  },
  {
    path: "/payment",
    route: paymentRouter,
  },
  {
    path: "/guide",
    route: guideRouter,
  },
  {
    path: "/otp",
    route: otpRouter,
  },
  {
    path: "/stats",
    route: statsRouter,
  },
  {
    path: "/review",
    route: reviewRouter,
  },
  {
    path: "/contact",
    route: contactRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});
