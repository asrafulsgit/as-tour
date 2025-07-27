
import { Router } from "express";
import { userControllers } from "./user.controllers";

const router = Router();

router.post('/register',userControllers.createUser)


export const userRouter = router;