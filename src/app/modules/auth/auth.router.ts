
import { Router } from "express";
import { authController } from "./auth.controllers";
import { authentication } from "../../middlewares/authentication.middleware";
import { object } from "zod";
import { Role } from "../user/user.interface";

const router = Router();

router.post('/login',authController.authLoginController);
router.post('/refresh-token',authController.getAccessTokenController);
router.get('/logout',authController.authLogoutController);
router.post('/reset-password',authentication(...Object.values(Role)) ,authController.authResetPasswordController);


export const authRouter = router;