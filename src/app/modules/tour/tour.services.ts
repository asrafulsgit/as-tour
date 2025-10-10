import AppError from "../../errorHelpers/appError"; 
import httpStatusCode from 'http-status-codes';
import { ITourType } from "./tour.interface";
import { TourType } from "./tour.model";

// create tourType service
const createTourTypeService =async(payload : Partial<ITourType>)=>{

    const isExistTourType = await TourType.findOne({name : payload.name});

    if(isExistTourType){ 
        throw new AppError(httpStatusCode.BAD_REQUEST,"TourType Already Exist.");
    }

    const tourType = await TourType.create(payload);

    return tourType;

}

// get all tourTypes service
const getAllTourTypeService =async()=>{

    const tourTypes = await TourType.find({});
    const totalTourTypes = await TourType.countDocuments();

    return {
         data : tourTypes,
         meta : {totalTourTypes}
    };

}

// get single tourType service
const getSingleTourTypeService =async(tourTypeId : string)=>{
    const tourType = await TourType.findById(tourTypeId);
    return tourType;
}

// update tourType service
const updateTourTypeService =async(tourTypeId : string, payload : Partial<ITourType>)=>{
    const tourType = await TourType.findById(tourTypeId);
    if(!tourType){
        throw new AppError(httpStatusCode.NOT_FOUND,"TourType not found");
    }

    const updateTourType = await TourType.findByIdAndUpdate(tourTypeId,payload,{new : true, runValidators : true})
    
    return updateTourType;
}

// delete tourType service
const deleteTourTypeService =async(tourTypeId : string)=>{
     await TourType.findByIdAndDelete(tourTypeId);
}



export const tourTypeServices ={
     createTourTypeService,
     getAllTourTypeService,
     getSingleTourTypeService,
     updateTourTypeService,
     deleteTourTypeService
}