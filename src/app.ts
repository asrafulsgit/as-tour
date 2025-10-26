import express,{ Application } from "express";
import cors from 'cors';
import { router } from "./app/routes/routes";
import { globalErrorHandle } from "./app/middlewares/globalError";
import { notFoundHandler } from "./app/middlewares/notFound";
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport'
import { envs } from "./app/config/env";
import './app/config/passport';
const app : Application = express();

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy",1);
app.use(cors({
    origin : envs.FRONTEND_URL,
    credentials : true
}));

app.use(expressSession({
    secret : envs.EXPRESS_SESSION_SECRET,
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1',router);


app.use(globalErrorHandle);

app.use(notFoundHandler);

export default app;