import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer";
import { guideControllers } from "./guide.controllers";

const router = Router();

// apply guide
router.post(
  "/apply",
  authentication(Role.USER),
  multerUpload.array("images"),
  guideControllers.applyGuideController,
);

// approve guide
router.post(
  "/approve/:id",
  authentication(Role.ADMIN, Role.SUPER_ADMIN),
  guideControllers.approveGuideApplicationController,
);
//reject guide
router.post(
  "/reject/:id",
  authentication(Role.ADMIN, Role.SUPER_ADMIN),
  guideControllers.rejectGuideApplicationController,
);

// get all guides
router.get(
  "/all",
  authentication(Role.ADMIN, Role.SUPER_ADMIN),
  guideControllers.getGuidesController
);  


// get guide applications
router.get(
  "/applications",
  authentication(Role.USER,Role.GUIDE),
  guideControllers.getGuideApplicationsController
);

// get single guide
router.get(
  "/:id",
  authentication(Role.ADMIN, Role.SUPER_ADMIN),
  guideControllers.getSingleGuideController
);


export const guideRouter = router;
