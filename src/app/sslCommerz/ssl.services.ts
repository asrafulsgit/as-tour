import axios from "axios";
import { envs } from "../config/env";
import { ISSlCommerz } from "./ssl.interface";
import AppError from "../errorHelpers/appError";
import httpStatusCode from "http-status-codes";


const sslCommerzInitializeService = async(payload : ISSlCommerz)=>{
    try {
        const data = {
                store_id: envs.SSL_STORE_ID,
                store_passwd: envs.SSL_STORE_PASS,
                total_amount: payload.amount,
                currency: "BDT",
                tran_id: payload.transactionId,
                success_url: `${envs.BACKEND_URL}${envs.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
                fail_url: `${envs.BACKEND_URL}${envs.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
                cancel_url: `${envs.BACKEND_URL}${envs.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
                // ipn_url: "http://localhost:3030/ipn",
                shipping_method: "N/A",
                product_name: "Tour",
                product_category: "Service",
                product_profile: "general",
                cus_name: payload.name,
                cus_email: payload.email,
                cus_add1: payload.address,
                cus_add2: "N/A",
                cus_city: "Dhaka",
                cus_state: "Dhaka",
                cus_postcode: "N/A",
                cus_country: "Bangladesh",
                cus_phone: payload.phone,
                cus_fax: "01711111111",
                ship_name: "N/A",
                ship_add1: "N/A",
                ship_add2: "N/A",
                ship_city: "N/A",
                ship_state: "N/A",
                ship_postcode: 0,
                ship_country: "N/A",
            }
    
            const payment = await axios({
                method : "POST",
                url : envs.SSL_PAYMENT_API,
                data, 
                headers : {"Content-Type" : "application/x-www-form-urlencoded"}
            });
    
            return payment.data;
    } catch (error : any) {
        throw new AppError(httpStatusCode.BAD_REQUEST,error.message)
    }
};


export const sslCommerzServices = {
    sslCommerzInitializeService
}