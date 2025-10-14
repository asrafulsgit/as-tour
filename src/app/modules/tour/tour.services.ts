import AppError from "../../errorHelpers/appError"; 
import httpStatusCode from 'http-status-codes';
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";

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


// create tour service
const createTourService =async(payload : Partial<ITour>)=>{

    const isExistTour = await Tour.findOne({title : payload.title});

    if(isExistTour){ 
        throw new AppError(httpStatusCode.BAD_REQUEST,"Tour Already Exist.");
    }

    const tour = await Tour.create(payload);

    return tour;
}

// get all tours  service
const getAllToursService =async()=>{
    const tours = await Tour.find({});
    const totalTours = await Tour.countDocuments();

    return {
         data : tours,
         meta : {totalTours}
    };

}

// get single tour service
const getSingleTourService =async(tourId : string)=>{
    const tour = await Tour.findById(tourId);
    return tour;
}

// update tour service
const updateTourService =async(tourId : string, payload : Partial<ITour>)=>{
    const tour = await Tour.findById(tourId);
    if(!tour){
        throw new AppError(httpStatusCode.NOT_FOUND,"Tour not found");
    }

    const updateTour = await Tour.findByIdAndUpdate(tourId,payload,{new : true, runValidators : true})
    
    return updateTour;
}

// delete tour service
const deleteTourService =async(tourId : string)=>{
     await Tour.findByIdAndDelete(tourId);
}

export const tourServices = {
    createTourService,
    getAllToursService,
    getSingleTourService,
    updateTourService,
    deleteTourService
}