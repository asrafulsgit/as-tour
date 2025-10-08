
import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controllers";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "../user/user.interface";
import passport from "passport";
import { envs } from "../../config/env";

const router = Router();

router.post('/login',authController.authLoginController);
router.post('/refresh-token',authController.getAccessTokenController);
router.get('/logout',authController.authLogoutController);
router.post('/reset-password',authentication(...Object.values(Role)) ,authController.authResetPasswordController);


router.get('/google',(req:Request,res:Response,next:NextFunction)=>{
    passport.authenticate("google",{scope : ['profile','email']})(req,res,next)
})

router.get('/google/callback',passport.authenticate("google",{failureRedirect : '/google-auth/failed'}),authController.googleAuthLoginController)

export const authRouter = router;