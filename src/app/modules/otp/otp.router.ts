import { Router } from "express";
import { OTPControllers } from "./otp.controllers";


const router = Router();

router.post('/send',OTPControllers.sendOTPController);
// router.post('/verify',authController.getAccessTokenController);

export const otpRouter = router;