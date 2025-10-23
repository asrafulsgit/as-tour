import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatusCode  from "http-status-codes";
import { paymentServices } from "./payment.services";
import { envs } from "../../config/env";


// re payment controller 
const initPaymentController = asyncHandler(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await paymentServices.initPaymentService(bookingId as string)
    sendResponse(res, {
        statusCode: httpStatusCode.CREATED,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
});


// payment success controller
const paymentSuccessController = asyncHandler(async (req: Request, 
    res: Response) => { 
   const query = req.query;
   const result = await paymentServices.paymentSuccessService(query as Record<string, string>)

    if (result.success) {
        res.redirect(`${envs.FRONTEND_URL}${envs.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

// payment fail controller
const paymentFailController = asyncHandler(async (req: Request, 
    res: Response) => { 
   const query = req.query;
   const result = await paymentServices.paymentFailService(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envs.FRONTEND_URL}${envs.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});

// payment cancel controller
const paymentCancelController = asyncHandler(async (req: Request, 
    res: Response) => { 
   const query = req.query;
   const result = await paymentServices.paymentCancelService(query as Record<string, string>)

    if (!result.success) {
        res.redirect(`${envs.FRONTEND_URL}${envs.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`)
    }
});


export const paymentControllers ={
    paymentSuccessController,
    paymentFailController,
    paymentCancelController,
    initPaymentController
}