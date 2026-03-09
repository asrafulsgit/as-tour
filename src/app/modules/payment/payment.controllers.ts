import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatusCode  from "http-status-codes";
import { paymentServices } from "./payment.services";
import { envs } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { sslCommerzServices } from "../sslCommerz/ssl.services";


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

// payment invoice controller
const paymentInvoiceController = asyncHandler(async (req: Request, 
    res: Response) => { 
   const paymentId = req.params.paymentId as string;
   const user = req.user as JwtPayload;
   const result = await paymentServices.getInvoiceService(paymentId,user.id)
    sendResponse(res, {
        statusCode: httpStatusCode.OK,
        success: true,
        message: "Payment invoice retrived",
        data: result,
    });
     
});

// payment validation controller
const validatePaymentController = asyncHandler(async (req: Request, res: Response) => {
        
        await sslCommerzServices.validatePaymentService(req.body)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Payment Validated Successfully",
            data: null,
        });
    }
);


export const paymentControllers ={
    paymentSuccessController,
    paymentFailController,
    paymentCancelController,
    initPaymentController,
    paymentInvoiceController,
    validatePaymentController
}