
import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controllers";
import { authentication } from "../../middlewares/authentication.middleware";
import { IUser, Role } from "../user/user.interface";
import passport from "passport"; 
import { envs } from "../../config/env";

const router = Router();

router.post('/login',authController.authLoginController);
router.post('/refresh-token',authController.getAccessTokenController);
router.get('/logout',authController.authLogoutController);

router.post('/change-password',authentication(...Object.values(Role)),
authController.authChangePasswordController);

router.post('/set-password',authentication(...Object.values(Role)),
authController.authSetPasswordController);

router.post('/forgot-password',authController.authForgotPasswordController);
router.post('/reset-password',authentication(...Object.values(Role)),authController.authResetPasswordController);


router.get('/google',(req:Request,res:Response,next:NextFunction)=>{
    passport.authenticate("google",{scope : ['profile','email']})(req,res,next)
});

router.get("/google/callback", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "google",
    (
      err: any,
      user: IUser | false,
      info: { message?: string }
    ) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        const message = info?.message || "Google authentication failed";
        return res.redirect(
          `${envs.FRONTEND_URL}/auth/google/failed?message=${encodeURIComponent(message)}`
        );
      }

      req.logIn(user, (err) => {
        if (err) return next(err);

        return authController.googleAuthLoginController(req, res, next);
      });
    }
  )(req, res, next);
});

export const authRouter = router;
 