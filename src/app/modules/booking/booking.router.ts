import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "../user/user.interface";
import { bookingControllers } from "./booking.controllers";

const router = Router();


// create booking 
router.post('/create',authentication(Role.USER), bookingControllers.createBookingController);

// get all bookings 
router.get("/all",
    authentication(Role.ADMIN, Role.SUPER_ADMIN),
    bookingControllers.getAllBookingsController
);

// get my bookings 
router.get("/my-bookings",
    authentication(...Object.values(Role)),
    bookingControllers.getUserBookingsController
);

// get single booking
router.get("/:bookingId",
    authentication(...Object.values(Role)), 
    bookingControllers.getSingleBookingController
); 

// update booking
router.patch("/:bookingId/status",
    authentication(Role.USER,Role.ADMIN,Role.SUPER_ADMIN),
    bookingControllers.updateBookingStatusController
);





export const bookingRouter = router;

