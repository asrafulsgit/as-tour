import { IUser } from "./user.interface";
import { User } from "./user.model";


const userCreateService =async(payload : Partial<IUser>)=>{
    const {name,email}= payload;

    const user = await User.create({
                name, email
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