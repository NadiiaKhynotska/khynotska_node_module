import jwt from "jsonwebtoken";

import { configs } from "../configs";
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
}

export const tokenService = new TokenService();
