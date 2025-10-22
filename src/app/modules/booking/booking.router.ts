import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "../user/user.interface";
import { bookingControllers } from "./booking.controllers";

const router = Router();


// create booking 
router.post('/create',authentication(Role.USER), bookingControllers.createBookingController);

// // get all tour 
// router.get('/all-tours',tourControllers.getAllToursController);

// // get single tour
// router.get('/:id',tourControllers.getSingleTourController);

// //update tour
// router.patch('/:id',authentication(Role.ADMIN,Role.SUPER_ADMIN),tourControllers.updateTourController);

// //delete tour
// router.delete('/:id',authentication(Role.ADMIN,Role.SUPER_ADMIN),tourControllers.deletetourController);


export const bookingRouter = router;

