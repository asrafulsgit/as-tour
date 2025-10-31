import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatusCode from "http-status-codes";
import { envs } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from 'bcryptjs';

const userCreateService =async(payload : Partial<IUser>)=>{
    const {email,password,...rest}= payload;

    const isUserExist = await User.findOne({email});

    if(isUserExist){ 
        throw new AppError(httpStatusCode.BAD_REQUEST,"User Already Exist.");
    }

    const hashPassword = await bcrypt.hash(password as string,Number(envs.BCRYPT_SALT));

    const authProvider : IAuthProvider = {provider : "Creadentials", providerId : email as string};
    await User.create({
            email,
            password : hashPassword,
            auths : [authProvider] ,
            ...rest
        });
}

const userUpdateService = async(userId : string, payload : Partial<IUser>,decodedToken : JwtPayload)=>{
    const isUserExist = await User.findById(userId);
    if(!isUserExist){
        throw new AppError(httpStatusCode.NOT_FOUND, "User not found");
    }
    if(payload.role){

        if(decodedToken.role === Role.GUIDE || decodedToken.role === Role.USER){
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");
        }

        if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");
        }
    }

    if(payload.isActive || payload.isDeleted || payload.isVerified){
        if(decodedToken.role === Role.GUIDE || decodedToken.role === Role.USER){
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");
        }
    }

    if(payload.password){
        payload.password = await bcrypt.hash(payload.password,envs.BCRYPT_SALT);
    }

    const updatedUser = await User.findByIdAndUpdate(userId,payload,{new : true, runValidators : true});
    return updatedUser;
}

const getAllUserService =async()=>{
    const users = await User.find().select('-password');
    const total = await User.countDocuments();
    return {
        users,
        meta : {total}
    };
}

export const userServices ={
    userCreateService,
    userUpdateService,
    getAllUserService
}