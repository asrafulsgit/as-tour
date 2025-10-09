import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { IDivision } from "./division.interface";
import { Division } from "./division.model";
import httpStatusCode from 'http-status-codes';

// create division service
const createDivisionService =async(payload : Partial<IDivision>)=>{

    const isExistDivision = await Division.findOne({name : payload.name});

    if(isExistDivision){ 
        throw new AppError(httpStatusCode.BAD_REQUEST,"Division Already Exist.");
    }

    // const baseSlug = payload.name?.toLocaleLowerCase().split(" ").join("-");
    // const slug = `${baseSlug}-division`
    

    const division = await Division.create(payload);

    return division;

}

// get all divisions service
const getAllDivisionsService =async()=>{

    const divisions = await Division.find({});
    const totalDivisions = await Division.countDocuments();

    return {
         data : divisions,
         meta : {totalDivisions}
    };

}

// get single division service
const getSingleDivisionService =async(slug : string)=>{

    const division = await Division.findOne({slug});

    return division;

}

export const divisionServices ={
    createDivisionService,
    getAllDivisionsService,
    getSingleDivisionService
}