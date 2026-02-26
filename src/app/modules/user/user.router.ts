import { Router } from "express";
import { userControllers } from "./user.controllers";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer";

const router = Router();

router.post("/register", userControllers.createUser);
router.get(
  "/all-users",
  authentication(Role.ADMIN, Role.SUPER_ADMIN),
  userControllers.getAllUsers,
);
router.get(
  "/me",
  authentication(...Object.values(Role)),
  userControllers.getUser,
);

router.get(
  "/booking/stats",
  authentication(Role.USER),
  userControllers.getUserBookingStats,
);

router.get(
  "/:id", 
  authentication(Role.SUPER_ADMIN,Role.SUPER_ADMIN),
  userControllers.getUserDetails,
);
router.patch(
  "/:id",
  multerUpload.single("image"),
  authentication(...Object.values(Role)),
  userControllers.updateUser,
);

export const userRouter = router;
