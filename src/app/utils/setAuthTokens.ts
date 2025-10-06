import { Response } from "express";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const setAuthTokens = (res: Response, tokens: AuthTokens) => {
  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }
  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
