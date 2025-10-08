import { model, Schema } from "mongoose";
import { ITour } from "./tour.interface";

const tourSchema = new Schema<ITour>({
    title : {type : String, required : true},
    slug : {type : String, required : true, 
        unique : true},
    description : {type : String},
    images : {type : [String],default : []},
    location : {type : String },
    costFrom : {type : Number},
    


},{
    timestamps : true,
    versionKey : false
});

export const Tour = model<ITour>('Tour',tourSchema);