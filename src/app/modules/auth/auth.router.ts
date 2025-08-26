
import { Router } from "express";
import { authController } from "./auth.controllers";

const router = Router();

router.post('/login',authController.authLoginController);


export const authRouter = router;