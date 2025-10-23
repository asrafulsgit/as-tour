import { Router } from "express"; 
import { paymentControllers } from "./payment.controllers";

const router = Router();




// payment successfull 
router.post('/success', paymentControllers.paymentSuccessController);

// payment successfull 
router.post('/success', paymentControllers.paymentSuccessController);

// payment fail 
router.post('/fail',paymentControllers.paymentFailController);

// payment cancel  
router.post('/cancel',paymentControllers.paymentCancelController);
 

export const paymentRouter = router;

