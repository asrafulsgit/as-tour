import { Router } from "express";
import { contactControllers } from "./contact.controllers";

const router = Router();

router.post("/email", contactControllers.contact);

export const contactRouter = router;
