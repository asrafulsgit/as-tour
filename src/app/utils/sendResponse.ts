import { Response } from "express";

interface Meta {
    total : number
}

interface TResponse<T> {
    statusCode : number;
    success : boolean;
    message : string;
    data : T,
    meta ?: Meta;
}

export const sendResponse =<T>(res : Response, data : TResponse<T>)=>{
    return res.status(data.statusCode).json({
        success : data.success,
        message : data.message,
        data : data.data,
        meta : data.meta
    })
}