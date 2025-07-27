import { Router } from "express";
import { userRouter } from "../modules/user/user.router";



export const router  = Router();


const routes = [
    {
        path : '/user',
        route : userRouter
    }
]


routes.forEach((route)=>{
    router.use(route.path, route.route);
})


