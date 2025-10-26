import { Router } from "express"; 
import { paymentControllers } from "./payment.controllers";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "../user/user.interface";

const router = Router();




// payment successfull 
router.post('/re-payment/:bookingId', paymentControllers.initPaymentController);

// payment successfull 
router.post('/success', paymentControllers.paymentSuccessController);

// payment fail 
router.post('/fail',paymentControllers.paymentFailController);

// payment cancel  
router.post('/cancel',paymentControllers.paymentCancelController);

// payment invoice download
router.get('/invoice/:paymentId',authentication(Role.USER),paymentControllers.paymentInvoiceController);

// payment validation
router.post("/validate-payment",paymentControllers.validatePaymentController);

export const paymentRouter = router;

