import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "../user/user.interface";
import { multerUpload } from "../../config/multer";
import { blogControllers } from "./blog.controllers";

const router = Router();

router.post(
  "/",
  authentication(...Object.values(Role)),
  multerUpload.single("image"),
  blogControllers.createBlogController,
);
router.get("/all", blogControllers.getAllBlogsController);

router.get("/:id", blogControllers.getSingleBlogController);

router.patch(
  "/:id",
  authentication(...Object.values(Role)),
  multerUpload.single("image"),
  blogControllers.updateBlogController,
);

router.delete(
  "/:id",
  authentication(...Object.values(Role)),
  blogControllers.deleteBlogController,
);

export const blogRouter = router;
