import jwt from "jsonwebtoken";

import { configs } from "../configs";
import { EToken } from "../enums";
import { ApiError } from "../errors";
import { ITokenPayload } from "../types";

class TokenService {
  public generateTokensPair(payload: ITokenPayload) {
    const accessToken = jwt.sign(payload, configs.SECRET_ACCESS_KEY, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(payload, configs.SECRET_REFRESH_KEY, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(token: string, tokenType: EToken): ITokenPayload {

    try {
      let secret: string;
      switch (tokenType) {
        case EToken.AccessToken:
          secret = configs.SECRET_ACCESS_KEY;
          break;
        case EToken.RefreshToken:
          secret = configs.SECRET_REFRESH_KEY;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid ", 401);
    }
  }
}

export const tokenService = new TokenService();
