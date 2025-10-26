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
  SSL_IPN_URL:string;
  SSL_SUCCESS_BACKEND_URL : string;
SSL_FAIL_BACKEND_URL : string;
SSL_CANCEL_BACKEND_URL : string;
SSL_SUCCESS_FRONTEND_URL : string;
SSL_FAIL_FRONTEND_URL : string;
SSL_CANCEL_FRONTEND_URL : string;
CLOUD_NAME : string;
CLOUD_API_KEY : string;
CLOUD_API_SECRET : string;
SMTP_PASS : string;
SMTP_USER : string;
SMTP_HOST : string;
SMTP_FROM : string;
SMTP_PORT : string;
REDIS_PASS : string;
REDIS_USERNAME : string;
REDIS_HOST : string;
REDIS_PORT : string;
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
"CLOUD_NAME",
"CLOUD_API_KEY",
"CLOUD_API_SECRET",
"SMTP_PASS",
"SMTP_USER",
"SMTP_HOST",
"SMTP_FROM",
"SMTP_PORT",
"REDIS_PASS",
"REDIS_USERNAME",
"REDIS_HOST",
"REDIS_PORT","SSL_IPN_URL"
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
    SSL_IPN_URL: process.env.SSL_IPN_URL as string,
    SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
    SSL_SUCCESS_BACKEND_URL : process.env.SSL_SUCCESS_BACKEND_URL as string,
    SSL_FAIL_BACKEND_URL : process.env.SSL_FAIL_BACKEND_URL as string,
    SSL_CANCEL_BACKEND_URL : process.env.SSL_CANCEL_BACKEND_URL as string,
    SSL_SUCCESS_FRONTEND_URL : process.env.SSL_SUCCESS_FRONTEND_URL as string,
    SSL_FAIL_FRONTEND_URL : process.env.SSL_FAIL_FRONTEND_URL as string,
    SSL_CANCEL_FRONTEND_URL : process.env.SSL_CANCEL_FRONTEND_URL as string,
    CLOUD_NAME : process.env.CLOUD_NAME as string,
    CLOUD_API_KEY : process.env.CLOUD_API_KEY as string,
    CLOUD_API_SECRET : process.env.CLOUD_API_SECRET as string,
    SMTP_PASS : process.env.SMTP_PASS as string,
    SMTP_USER : process.env.SMTP_USER as string,
    SMTP_HOST : process.env.SMTP_HOST as string,
    SMTP_FROM : process.env.SMTP_FROM as string,
    SMTP_PORT : process.env.SMTP_PORT as string,
    REDIS_PASS : process.env.REDIS_PASS as string,
REDIS_USERNAME : process.env.REDIS_USERNAME as string,
REDIS_HOST : process.env.REDIS_HOST as string,
REDIS_PORT : process.env.REDIS_PORT as string,
  };
};

export const envs = envsLoading();
