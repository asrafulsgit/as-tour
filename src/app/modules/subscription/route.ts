import { Router } from "express";
import { subscriptionControllers } from "./subscription.controllers";

const router = Router();

router.post("/", subscriptionControllers.createSubscriptionController);

export const subscriptionRouter = router;
