import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatusCode from 'http-status-codes';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { envs } from "../../config/env";
import { generateToken } from "../../utils/generateToken";

const authLoginService = async(payload : Partial<IUser>)=>{
    const {email,password}= payload;

    const isUserExist = await User.findOne({email});

    if(!isUserExist){ 
        throw new AppError(httpStatusCode.NOT_FOUND,"User is not found.");
    }

    const isCorrectPassword = await bcrypt.compare(password as string,isUserExist.password as string);
   
    if(!isCorrectPassword){ 
        throw new AppError(httpStatusCode.BAD_REQUEST,"Incorrect password.");
    }
    const tokenPayload = {
        id : isUserExist._id,
        email : isUserExist.email,
        role : isUserExist.role
    }
    const token = generateToken(tokenPayload,envs.JWT_ACCESS_TOKEN_SECRET,envs.JWT_ACCESS_TOKEN_EXPIRESIN)

    return {
        token
    };
}


export const authServices = {
    authLoginService
}
