import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatusCode from "http-status-codes";
import bcrypt from "bcryptjs";


const userCreateService =async(payload : Partial<IUser>)=>{
    const {email,password,...rest}= payload;

    const isUserExist = await User.findOne({email});

    if(isUserExist){ 
        throw new AppError(httpStatusCode.BAD_REQUEST,"User Already Exist.");
    }

    const hashPassword = await bcrypt.hash(password as string,10);

    const authProvider : IAuthProvider = {provider : "Creadentials", providerId : email as string};
    const user = await User.create({
            email,
            password : hashPassword,
            auths : [authProvider] ,
            ...rest
        });

    return user;

}

const getAllUserService =async()=>{
    const users = await User.find();
    const total = await User.countDocuments();
    return {
        users,
        meta : {total}
    };
}

export const userServices ={
    userCreateService,
    getAllUserService
}