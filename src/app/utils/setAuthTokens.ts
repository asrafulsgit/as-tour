import { Response } from "express";
import { envs } from "../config/env";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthTokens = (res: Response, tokens: AuthTokens) => {
  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: envs.NODE_ENV === "production",
      sameSite: envs.NODE_ENV === "production" ? "none" : "lax",
    });
  }
  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: envs.NODE_ENV === "production",
      sameSite: envs.NODE_ENV === "production" ? "none" : "lax",
    });
  }
};
