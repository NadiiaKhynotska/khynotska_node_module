import { NextFunction, Request, Response } from "express";

import { EToken } from "../enums";
import { ApiError } from "../errors";
import { tokenRepository } from "../repositories";
import { tokenService } from "../services";

class AuthMiddleware {
  public checkToken(tokenType: EToken) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const tokenString = req.get("Authorization");
        if (!tokenString) {
          throw new ApiError("No token", 401);
        }

        const token = tokenString.split("Bearer ")[1];
        const jwtPayload = tokenService.checkToken(token, tokenType);

        const entity = await tokenRepository.getOneBy(
          tokenType === "accessToken"
            ? { accessToken: token }
            : { refreshToken: token },
        );

        if (!entity) {
          throw new ApiError("Token not valid", 401);
        }

        req.res.locals.jwtPayload = jwtPayload;
        req.res.locals.token = token;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();
