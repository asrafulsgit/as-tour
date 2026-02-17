import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "../user/user.interface";
import { tourControllers, tourTypeControllers } from "./tour.controllers";
import { multerUpload } from "../../config/multer";

const router = Router();

/*------------------------Tour Type Routers------------------------------*/

// create tourType
router.post(
  "/tourType/create",
  authentication(Role.ADMIN, Role.SUPER_ADMIN),
  tourTypeControllers.createTourTypeController,
);

//get all tourTypes
router.get("/tourType/all", tourTypeControllers.getAllTourTypesController);

// get single tourType
router.get("/tourType/:id", tourTypeControllers.getSingleTourTypeController);

//update tourType
router.patch(
  "/tourType/:id",
  authentication(Role.ADMIN, Role.SUPER_ADMIN),
  tourTypeControllers.updateTourTypeController,
);

//delete tourType
router.delete(
  "/tourType/:id",
  authentication(Role.ADMIN, Role.SUPER_ADMIN),
  tourTypeControllers.deletetourTypeController,
);

/*------------------------Tour Routers------------------------------*/

// create tour
router.post(
  "/create",
  authentication(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("images"),
  tourControllers.createTourController,
);

// get all tour
router.get("/all-tours", tourControllers.getAllToursController);

// get single tour
router.get("/:id", tourControllers.getSingleTourController);

//update tour
router.patch(
  "/:id",
  authentication(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("images"),
  tourControllers.updateTourController,
);

//delete tour
router.delete(
  "/:id",
  authentication(Role.ADMIN, Role.SUPER_ADMIN),
  tourControllers.deletetourController,
);

export const tourRouter = router;
