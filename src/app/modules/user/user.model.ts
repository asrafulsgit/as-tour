import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authSchema = new Schema<IAuthProvider>({
    provider : {type : String, required : true},
    providerId : {type : String, required : true}
},{versionKey : false, _id : false})

const userSchema = new Schema<IUser>({
    name : {type : String, required : true},
    email : {type : String, unique : true ,required : true},
    password :{type : String},
    phone  : {type : String},
    picture  :{type : String},
    address :{type : String}, 
    isDeleted  : {type : String},
    isActive  : {
        type : String,
        enum : Object.values(IsActive),
        default : IsActive.ACTIVE
    },
    isVerified : {type : Boolean, default : false},
    auths : [authSchema],
    role : {
        type : String,
        enum : Object.values(Role),
        default : Role.USER
    }
},{
    versionKey : false,
    timestamps : true
});


export const User = model<IUser>("User",userSchema);

