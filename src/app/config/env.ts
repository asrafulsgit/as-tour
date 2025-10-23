import dotenv from "dotenv";

dotenv.config();

interface EnvsConfig {
  PORT: string;
  MONGODB_URL: string;
  NODE_ENV: string;
  JWT_ACCESS_TOKEN_SECRET: string;
  JWT_ACCESS_TOKEN_EXPIRESIN: string;
  JWT_REFRESH_TOKEN_SECRET: string;
  JWT_REFRESH_TOKEN_EXPIRESIN: string;
  BCRYPT_SALT: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  FRONTEND_URL: string;
  BACKEND_URL: string;
  EXPRESS_SESSION_SECRET: string;
  SSL_STORE_ID: string;
  SSL_STORE_PASS: string;
  SSL_PAYMENT_API: string;
  SSL_VALIDATION_API: string;
  SSL_SUCCESS_BACKEND_URL : string;
SSL_FAIL_BACKEND_URL : string;
SSL_CANCEL_BACKEND_URL : string;
SSL_SUCCESS_FRONTEND_URL : string;
SSL_FAIL_FRONTEND_URL : string;
SSL_CANCEL_FRONTEND_URL : string;
}

const envsLoading = (): EnvsConfig => {
  const properties: string[] = [
    "MONGODB_URL",
    "PORT",
    "NODE_ENV",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_ACCESS_TOKEN_EXPIRESIN",
    "BCRYPT_SALT",
    "JWT_REFRESH_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN_EXPIRESIN",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "BACKEND_URL",
    "SSL_STORE_ID",
    "SSL_STORE_PASS",
    "SSL_PAYMENT_API",
    "SSL_VALIDATION_API",
    "SSL_SUCCESS_BACKEND_URL",
"SSL_FAIL_BACKEND_URL",
"SSL_CANCEL_BACKEND_URL",
"SSL_SUCCESS_FRONTEND_URL",
"SSL_FAIL_FRONTEND_URL",
"SSL_CANCEL_FRONTEND_URL",
  ];

  properties.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing env variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    MONGODB_URL: process.env.MONGODB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
    JWT_ACCESS_TOKEN_EXPIRESIN: process.env
      .JWT_ACCESS_TOKEN_EXPIRESIN as string,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
    JWT_REFRESH_TOKEN_EXPIRESIN: process.env
      .JWT_REFRESH_TOKEN_EXPIRESIN as string,
    BCRYPT_SALT: process.env.BCRYPT_SALT as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    BACKEND_URL: process.env.BACKEND_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    SSL_STORE_ID: process.env.SSL_STORE_ID as string,
    SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
    SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
    SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
    SSL_SUCCESS_BACKEND_URL : process.env.SSL_SUCCESS_BACKEND_URL as string,
SSL_FAIL_BACKEND_URL : process.env.SSL_FAIL_BACKEND_URL as string,
SSL_CANCEL_BACKEND_URL : process.env.SSL_CANCEL_BACKEND_URL as string,
SSL_SUCCESS_FRONTEND_URL : process.env.SSL_SUCCESS_FRONTEND_URL as string,
SSL_FAIL_FRONTEND_URL : process.env.SSL_FAIL_FRONTEND_URL as string,
SSL_CANCEL_FRONTEND_URL : process.env.SSL_CANCEL_FRONTEND_URL as string,
  };
};

export const envs = envsLoading();
