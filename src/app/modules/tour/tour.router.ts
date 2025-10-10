


import { Router } from "express";
import { authentication } from "../../middlewares/authentication.middleware";
import { Role } from "../user/user.interface"; 
import { tourTypeControllers } from "./tour.controllers";

const router = Router();

// create tourType
router.post('/tourType/create',authentication(Role.ADMIN,Role.SUPER_ADMIN),tourTypeControllers.createTourTypeController);

//get all tourTypes
router.get('/tourType/all',tourTypeControllers.getAllTourTypesController);

// get single tourType
router.get('/:id',tourTypeControllers.getSingleTourTypeController);

//update tourType
router.patch('/:id',authentication(Role.ADMIN,Role.SUPER_ADMIN),tourTypeControllers.updateTourTypeController);

//delete tourType
router.delete('/:id',authentication(Role.ADMIN,Role.SUPER_ADMIN),tourTypeControllers.deletetourTypeController);


export const tourRouter = router;