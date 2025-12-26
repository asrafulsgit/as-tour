# 🧠 TourMate Backend

**Project Name:** TourMate

---

## 🌟 Project Overview

A backend system for managing and organizing tours, where admins and super admins can create and manage tour packages. Users can explore available tours, book their desired ones, and make secure payments through SSLCommerz. Each tour includes assigned guides responsible for assisting tourists during their trips.

---

## 🌟 Project Features

The TourMate backend provides a secure and scalable RESTful API that connects with the frontend application. It handles:

- User registration and authentication (including Google OAuth)
- Role-based access control for users, guides, admins, and super admins
- Tour creation, management, and booking system
- Secure online payment integration using SSLCommerz
- Guide assignment for each tour to assist tourists

---

## 🧰 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB (Mongoose)**
- **SSLCommerz**
- **Passport**
- **JWT**

---

## 🚀 Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/asrafulsgit/tour-mate-server.git
cd tour-mate-server
```

2. Install Dependencies

```bash
 npm install
```

3. Environment Variables
   Create a .env file in the root directory with the following values:

```env
MONGODB_URL =
PORT =
NODE_ENV =
JWT_ACCESS_TOKEN_SECRET =
JWT_ACCESS_TOKEN_EXPIRESIN =

JWT_REFRESH_TOKEN_SECRET =
JWT_REFRESH_TOKEN_EXPIRESIN =

BCRYPT_SALT =


GOOGLE_CLIENT_ID =
GOOGLE_CLIENT_SECRET =
GOOGLE_CALLBACK_URL =

EXPRESS_SESSION_SECRET =

FRONTEND_URL =
BACKEND_URL =

# SSL Commerz setup
SSL_STORE_ID =
SSL_STORE_PASS =
SSL_PAYMENT_API =
SSL_VALIDATION_API =
SSL_IPN_URL=

# SSL Commerz BACKEND URLs
SSL_SUCCESS_BACKEND_URL=
SSL_FAIL_BACKEND_URL=
SSL_CANCEL_BACKEND_URL=

# SSL Commerz FRONTEND URLs
SSL_SUCCESS_FRONTEND_URL=
SSL_FAIL_FRONTEND_URL=
SSL_CANCEL_FRONTEND_URL=

# CLOUDINAY
CLOUD_NAME =
CLOUD_API_KEY =
CLOUD_API_SECRET =


#nodemailer
SMTP_PASS =
SMTP_USER =
SMTP_HOST =
SMTP_FROM =
SMTP_PORT =

#redis
REDIS_PASS =
REDIS_USERNAME =
REDIS_HOST =
REDIS_PORT =

```

4. Start the Server

```bash
npm run dev
```

## 🔗 API Endpoints

### Auth

| Method | Endpoint                     | Description               |
| ------ | ---------------------------- | ------------------------- |
| POST   | /api/v1/auth/login           | Login with email/password |
| POST   | /api/v1/auth/change-password | change password           |
| POST   | /api/v1/auth/set-password    | set password              |
| POST   | /api/v1/auth/forgot-password | forgot password           |
| POST   | /api/v1/auth/reset-password  | reset password            |
| POST   | /api/v1/auth/reset-password  | reset password            |
| POST   | /api/v1/auth/refresh-token   | get refresh token         |
| POST   | /api/v1/auth/logout          | Logout (clear cookie)     |
| POST   | /api/v1/auth/google          | Google OAuth login        |

---

### Users

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| POST   | /api/v1/user/register   | Register new user             |
| GET    | /api/v1/user/:id        | update user                   |
| GET    | /api/v1/user/all-users? | [ADMIN/SUPER_ADMIN] get users |

---

### Tour

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| POST   | /api/v1/tour/create     | [ADMIN/SUPER_ADMIN] create tour |
| GET    | /api/v1/tour/all-tours? | get tours                       |
| GET    | /api/v1/tour/:id        | get single tour                 |
| PATCH  | /api/v1/tour/:id        | [ADMIN/SUPER_ADMIN] update tour |
| DELETE | /api/v1/tour/:id        | [ADMIN/SUPER_ADMIN] delete tour |

---

### Tour Type

| Method | Endpoint                     | Description                          |
| ------ | ---------------------------- | ------------------------------------ |
| POST   | /api/v1/tour/tourType/create | [ADMIN/SUPER_ADMIN] create tour type |
| GET    | /api/v1/tour/tourType/all    | get all tour types                   |
| GET    | /api/v1/tour/tourType/:id    | get single tour type                 |
| PATCH  | /api/v1/tour/tourType/:id    | [ADMIN/SUPER_ADMIN] update tour type |
| DELETE | /api/v1/tour/tourType/:id    | [ADMIN/SUPER_ADMIN] delete tour type |

---

### Booking

| Method | Endpoint                          | Description                               |
| ------ | --------------------------------- | ----------------------------------------- |
| POST   | /api/v1/booking/create            | [USER] create booking                     |
| GET    | /api/v1/booking/all?              | [ADMIN/SUPER_ADMIN] Get bookings          |
| GET    | /api/v1/booking/:bookingId        | get single booking                        |
| PATCH  | /api/v1/booking/:bookingId/status | [ADMIN/SUPER_ADMIN] update booking status |
| GET    | /api/v1/booking/my-bookings       | [USER] my bookings                        |

---

### 📝 Payment

| Method                        | Endpoint | Description |
| ----------------------------- | -------- | ----------- |
| All payment APIs are private. |

---

### Verifications

| Method | Endpoint           | Description |
| ------ | ------------------ | ----------- |
| POST   | /api/v1/otp/send   | OTP send    |
| POST   | /api/v1/otp/verify | OTP verify  |

---

### Division

| Method | Endpoint                | Description                          |
| ------ | ----------------------- | ------------------------------------ |
| POST   | /api/v1/division/create | [ADMIN/SUPER_ADMIN] create division  |
| GET    | /api/v1/division/all    | get all divisions                    |
| GET    | /api/v1/division/:slug  | get single divisions                 |
| PATCH  | /api/v1/division/:id    | [ADMIN/SUPER_ADMIN] update divisions |
| DELETE | /api/v1/division/:id    | [ADMIN/SUPER_ADMIN] delete divisions |

---

### Stats

| Method | Endpoint              | Description                       |
| ------ | --------------------- | --------------------------------- |
| GET    | /api/v1/stats/user    | [ADMIN/SUPER_ADMIN] user stats    |
| GET    | /api/v1/stats/tour    | [ADMIN/SUPER_ADMIN] tour stats    |
| GET    | /api/v1/stats/booking | [ADMIN/SUPER_ADMIN] booking stats |
| GET    | /api/v1/stats/payment | [ADMIN/SUPER_ADMIN] payment stats |

---

## 📦 Mongoose Models

# User

```javascript
import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authSchema =
  new Schema() <
  IAuthProvider >
  ({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  { versionKey: false, _id: false });

const userSchema =
  new Schema() <
  IUser >
  ({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: String },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authSchema],
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  });

export const User = model < IUser > ("User", userSchema);
```

# Tour

```javascript
import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true, versionKey: false }
);

export const TourType = model<ITourType>("TourType", tourTypeSchema);

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


tourSchema.pre("save", async function(next){

    if(this.isModified("title")){
        let slug = this.title.toLowerCase().split(" ").join("-");

        let count = 0;
        while(await Tour.exists({slug})){
            slug = `${slug}-${count++}`
        }

        this.slug = slug;
    }

    next();
});

tourSchema.pre("findOneAndUpdate", async function(next){
    const tour = this.getUpdate() as Partial<ITour>;
    if(tour.title){
        let slug = tour.title.toLowerCase().split(" ").join("-");

        let count = 0;
        while(await Tour.exists({slug})){
            slug = `${slug}-${count++}`
        }

        tour.slug = slug;
    }

    this.setUpdate(tour);

    next();
});

export const Tour = model<ITour>("Tour", tourSchema);
```

# Booking

```javascript
import { model, Schema } from "mongoose";
import { BOOKING_STATUS, IBooking } from "./booking.interface";

const bookingSchema =
  new Schema() <
  IBooking >
  ({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    guests: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  });

export const Booking = model < IBooking > ("Booking", bookingSchema);
```

# Payment

```javascript
import { model, Schema } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";

const paymentSchema =
  new Schema() <
  IPayment >
  ({
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentGateway: {
      type: Schema.Types.Mixed,
    },
    invoiceUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  });

export const Payment = model < IPayment > ("Payment", paymentSchema);
```

# Division

```javascript

import {model, Schema} from "mongoose"
import { IDivision } from "./division.interface"

const divisionShcema = new Schema<IDivision>({
    name :{
        type : String,
        required : [true, "Name is required"],
        unique : true
    },
    slug : {
        type : String,
        unique : true
    },
    thumbnail : {
        type : String
    },
    description : {
        type : String
    }
},{
    timestamps : true,
    versionKey : false
});


divisionShcema.pre("save", async function(next){

    if(this.isModified("name")){
        const baseSlug = this.name.toLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;

        let count = 0;
        while(await Division.exists({slug})){
            slug = `${slug}-${count++}`
        }

        this.slug = slug;
    }

    next();
});

divisionShcema.pre("findOneAndUpdate", async function(next){
    const division = this.getUpdate() as Partial<IDivision>;
    if(division.name){
        const baseSlug = division.name.toLowerCase().split(" ").join("-");
        let slug = `${baseSlug}-division`;

        let count = 0;
        while(await Division.exists({slug})){
            slug = `${slug}-${count++}`
        }

        division.slug = slug;
    }

    this.setUpdate(division);

    next();
});

export const Division = model<IDivision>('Division',divisionShcema);
```

## 🛠️ Error Handling

Custom error messages are returned for validation and business logic issues.

```javascript
class AppError extends Error {
    public statusCode : number;

    constructor(statusCode : number, message : string, stack = ''){
        super(message);
        this.statusCode = statusCode;

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export default AppError;
```

```javascript
import { NextFunction, Request, Response } from "express";
import { envs } from "../config/env";
import AppError from "../errorHelpers/appError";
import { deleteCloudinaryImage } from "../config/cloudinary";

export const globalErrorHandle = async(err : any , req : Request, res : Response, next : NextFunction)=>{
    let statusCode = 500;
    let message = `Something went wrong!`;

    // delete single image when api has error
    if(req.file){
        await deleteCloudinaryImage(req.file.path);
    }

    // delete multiple images when api has error
    if(req.files && Array.isArray(req.files) && req.files.length){
        const images = (req.files as Express.Multer.File[]).map(file => file.path);
        await Promise.all(images.map(image => deleteCloudinaryImage(image)));
    }

    //mongoose duplicate error
    if(err.code === 11000){
        statusCode = 400;
        const duplicate = err.message.match(/"([^"]*)"/)[1];
        message = `${duplicate} already exist!`
    }
    //mongoose CastError
    else if(err.name === 'CastError'){
        statusCode = 400;
        message = 'Invalid mongoDB object ID, Please provide valid ID.'
    }
    //mongoose ValidationError
    else if(err.name === "ValidationError"){
        statusCode = 400;
        message = "Invalid Input"
    }
    // here will be add a zod error

    // custom error
    else if(err instanceof AppError){
        statusCode = err.statusCode;
        message = err.message;
    }
    // server error
    else if(err instanceof Error){
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        success : false,
        message,
        err,
        stack : envs.NODE_ENV === 'development' ? err.stack : null
    })
}
```

```javascript
import { Request, Response } from "express";

import httpStatusCode from "http-status-codes";

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(httpStatusCode.NOT_FOUND).json({
    success: false,
    message: "Route not found.",
  });
};
```
