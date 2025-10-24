import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatusCode from 'http-status-codes';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from "jsonwebtoken";
import { envs } from "../../config/env";
import { generateToken } from "../../utils/generateToken";
import { createAccessTokenFromRefreshToken, getBothToken } from "../../utils/getBothToken";
import { decodedToken } from "../../utils/decodedToken";

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

    if (
            !isUserExist.isVerified
          ) {
            throw new AppError(
              httpStatusCode.BAD_REQUEST,
              `User is not verified`
            );
          }
          if (
            isUserExist.isActive === IsActive.BLOCKED ||
            isUserExist.isActive === IsActive.INACTIVE
          ) {
            throw new AppError(
              httpStatusCode.BAD_REQUEST,
              `User is ${isUserExist.isActive}`
            );
          }
    
          if (isUserExist.isDeleted) {
            throw new AppError(httpStatusCode.BAD_REQUEST, `User is deleted`);
          }

    const toekns = getBothToken(isUserExist);
    const user = isUserExist.toObject();
    delete user.password;
    
    return {
        accessToken : toekns.accessToken,
        refreshToken : toekns.refreshToken,
        user 
    };
}

const getAccessTokenService = async(token : string)=>{
    const newAccessToken = await createAccessTokenFromRefreshToken(token);
    
    return {
        accessToken : newAccessToken
    }
}
const changePasswordService = async(oldPassword : string, newPassword : string, userData : JwtPayload)=>{
     
    const user = await User.findById(userData.id);
    const isCorrectPassword = await bcrypt.compare(oldPassword,user?.password as string) 
    if(!isCorrectPassword){
        throw new AppError(httpStatusCode.BAD_REQUEST, "Old password does not match");
    }

    const hashedPassword = await bcrypt.hash(newPassword,Number(envs.BCRYPT_SALT));
    
    user!.password = hashedPassword;
    await user?.save();
}

const setPasswordService = async(userId : string, password : string)=>{
     
    const user = await User.findById(userId);
    
    if(!user) throw new AppError(httpStatusCode.NOT_FOUND, "User not found");

    if(user.password && user.auths.some(auth => auth.provider === "Creadentials")){
        throw new AppError(httpStatusCode.BAD_REQUEST, `You have already setup your password. 
            Please go to your plofile and change your password`);
    }

    const newAuths : IAuthProvider = {
        provider : "Creadentials",
        providerId :  user.email
    }

    const userAuths : IAuthProvider[] = [newAuths,...user.auths];

    const hashedPassword = await bcrypt.hash(password,Number(envs.BCRYPT_SALT));
    
    user.password = hashedPassword;
    user.auths = userAuths;
    
    await user.save();
}
// const resetPasswordService = async(userId : string, password : string)=>{
     
//     const user = await User.findById(userData.id);
//     const isCorrectPassword = await bcrypt.compare(oldPassword,user?.password as string) 
//     if(!isCorrectPassword){
//         throw new AppError(httpStatusCode.BAD_REQUEST, "Old password does not match");
//     }

//     const hashedPassword = await bcrypt.hash(newPassword,Number(envs.BCRYPT_SALT));
    
//     user!.password = hashedPassword;
//     await user?.save();
// }




export const authServices = {
    authLoginService,
    getAccessTokenService,
    changePasswordService,
    setPasswordService
}
