import { Router } from "express";
import { userControllers } from "./user.controllers";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "./user.interface";

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
router.patch(
  "/:id",
  authentication(...Object.values(Role)),
  userControllers.updateUser,
);

export const userRouter = router;
