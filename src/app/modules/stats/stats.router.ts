import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "../user/user.interface";
import { statsControllers } from "./stats.controllers";

const router = Router();

router.get(
    "/booking",
    authentication(Role.ADMIN, Role.SUPER_ADMIN),
    statsControllers.getBookingStatsController
);
router.get(
    "/payment",
    authentication(Role.ADMIN, Role.SUPER_ADMIN),
    statsControllers.getPaymentStatsController
);
router.get(
    "/user",
    authentication(Role.ADMIN, Role.SUPER_ADMIN),
    statsControllers.getUserStatsController
);
router.get(
    "/tour",
    authentication(Role.ADMIN, Role.SUPER_ADMIN),
    statsControllers.getTourStatsController
);

export const statsRouter = router;