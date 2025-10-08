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
  EXPRESS_SESSION_SECRET : string
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
    "FRONTEND_URL",
    "EXPRESS_SESSION_SECRET"
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
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL :  process.env.GOOGLE_CALLBACK_URL as string,
    FRONTEND_URL : process.env.FRONTEND_URL as string,
    EXPRESS_SESSION_SECRET : process.env.EXPRESS_SESSION_SECRET as string
  };
};

export const envs = envsLoading();
