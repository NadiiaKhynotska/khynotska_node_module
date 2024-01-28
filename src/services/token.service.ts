import jwt from "jsonwebtoken";

import { configs } from "../configs";
import { ERoles, EToken } from "../enums";
import { ApiError } from "../errors";
import { ITokenPayload } from "../types";

class TokenService {
  public generateTokensPair(payload: ITokenPayload, role: ERoles) {
    let accessTokenSecret: string;
    let accessExpiresIn: string;
    let refreshTokenSecret: string;
    let refreshExpiresIn: string;

    switch (role) {
      case ERoles.USER:
        accessTokenSecret = configs.SECRET_USER_ACCESS_KEY;
        accessExpiresIn = configs.JWT_USER_ACCESS_EXPIRES_IN;
        refreshTokenSecret = configs.SECRET_USER_REFRESH_KEY;
        refreshExpiresIn = configs.JWT_USER_REFRESH_EXPIRES_IN;
        break;
      case ERoles.ADMIN:
        accessTokenSecret = configs.SECRET_ADMIN_ACCESS_KEY;
        accessExpiresIn = configs.JWT_ADMIN_REFRESH_EXPIRES_IN;
        refreshTokenSecret = configs.SECRET_ADMIN_REFRESH_KEY;
        refreshExpiresIn = configs.JWT_ADMIN_REFRESH_EXPIRES_IN;
        break;
    }
    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: accessExpiresIn,
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public generateActionToken(payload: ITokenPayload, tokenType: EToken) {
    try {
      let actionTokenSecret: string;
      const actionTokenExpiresIn = configs.JWT_ACTION_TOKEN_EXPIRES_IN;

      switch (tokenType) {
        case EToken.ForgotPassword:
          actionTokenSecret = configs.SECRET_ACTION_KEY;
          break;
      }
      const actionToken = jwt.sign(payload, actionTokenSecret, {
        expiresIn: actionTokenExpiresIn,
      });

      return actionToken;
    } catch (e) {}
  }

  public checkToken(
    token: string,
    tokenType: EToken,
    role: ERoles,
  ): ITokenPayload {
    try {
      let secret: string;
      if (tokenType === EToken.AccessToken) {
        if (role === ERoles.USER) {
          secret = configs.SECRET_USER_ACCESS_KEY;
        } else if (role === ERoles.ADMIN) {
          secret = configs.SECRET_ADMIN_ACCESS_KEY;
        }
      } else if (tokenType === EToken.RefreshToken) {
        if (role === ERoles.USER) {
          secret = configs.SECRET_USER_REFRESH_KEY;
        } else if (role === ERoles.ADMIN) {
          secret = configs.SECRET_ADMIN_REFRESH_KEY;
        }
      } else if (tokenType === EToken.ForgotPassword) {
        if (role === ERoles.USER || role === ERoles.ADMIN) {
          secret = configs.SECRET_ACTION_KEY;
        }
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid !!!!", 401);
    }
  }
}

export const tokenService = new TokenService();
