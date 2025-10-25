import { Router } from "express";
import { OTPControllers } from "./otp.controllers";


const router = Router();

router.post('/send',OTPControllers.sendOTPController);
router.post('/verify',OTPControllers.verifyOTPController);

export const otpRouter = router;