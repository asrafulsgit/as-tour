
import {model, Schema} from "mongoose"
import { IDivision } from "./division.interface"

const divisionShcema = new Schema<IDivision>({
    name :{
        type : String,
        required : [true, "Name is required"],
        unique : true
    },
    slug : {
        type : String,
        required : [true,"Slug is required"],
        unique : true
    },
    thumbnail : {
        type : String 
    },
    description : {
        type : String 
    }
},{
    timestamps : true,
    versionKey : false
});

export const Division = model<IDivision>('Division',divisionShcema);