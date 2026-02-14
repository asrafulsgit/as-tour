import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "../user/user.interface"; 
import { reviewControllers } from "./review.controllers";

const router = Router();

// create review
router.post("/create", authentication(Role.USER),reviewControllers.createReviewController);

//get all reviews
router.get("/:tourId",reviewControllers.getAllReviewsController);

//delete review
router.delete("/:id", authentication(Role.ADMIN, Role.SUPER_ADMIN),reviewControllers.deleteReviewController);

export const reviewRouter = router;
