import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "../user/user.interface";
import { divisionControllers } from "./division.controllers";
import { multerUpload } from "../../config/multer";

const router = Router();

// create division
router.post('/create',
    authentication(Role.ADMIN,Role.SUPER_ADMIN),
    multerUpload.single('image'),
    divisionControllers.createDivisionController);

//get all divisions
router.get('/all',divisionControllers.getAllDivisionsController); 

router.get('/tour-count',divisionControllers.getAllDivisionsTourCountController); 

// get single division
router.get('/:slug',divisionControllers.getSingleDivisionController)

//update division
router.patch('/:id',
    authentication(Role.ADMIN,Role.SUPER_ADMIN),
    multerUpload.single('image'),
    divisionControllers.updateDivisionController);

//delete division
router.delete('/:id',authentication(Role.ADMIN,Role.SUPER_ADMIN),divisionControllers.deleteDivisionController);




export const divisionRouter = router;