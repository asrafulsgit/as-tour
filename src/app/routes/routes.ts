import { Router } from "express";
import { userRouter } from "../modules/user/user.router";
import { authRouter } from "../modules/auth/auth.router";
import { divisionRouter } from "../modules/division/division.router";

export const router  = Router();


const routes = [
    {
        path : '/user',
        route : userRouter
    },
    {
        path : '/auth',
        route : authRouter
    },
    {
        path : '/division',
        route : divisionRouter
    }
]


routes.forEach((route)=>{
    router.use(route.path, route.route);
})


