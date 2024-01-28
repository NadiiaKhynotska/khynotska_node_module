import { NextFunction, Request, Response } from "express";

import { EToken } from "../enums";
import { ApiError } from "../errors";
import { tokenRepository, userRepository } from "../repositories";
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

        const entity = await tokenRepository.getOneBy(
          tokenType === "accessToken"
            ? { accessToken: token }
            : { refreshToken: token },
        );

        if (!entity) {
          throw new ApiError("Token not valid", 401);
        }
        const user = await userRepository.getOneByParams({
          _id: entity._userId,
        });

        const jwtPayload = tokenService.checkToken(token, tokenType, user.role);

        req.res.locals.jwtPayload = jwtPayload;
        req.res.locals.token = token;
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public checkActionToken(tokenType: EToken) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const actionToken = req.params.token;
        let entity;
        switch (tokenType) {
          case EToken.ForgotPassword:
            entity = await tokenRepository.getOneActionTokenBy({
              actionToken,
            });
            break;
          case EToken.Activate:
            entity = await tokenRepository.getOneActionTokenBy({
              actionToken,
            });
            break;
          default:
            throw new ApiError("Token not valid", 401);
        }

        if (!entity) {
          throw new ApiError("Token not valid", 401);
        }
        const user = await userRepository.getOneByParams({
          _id: entity._userId,
        });

        const jwtPayload = tokenService.checkToken(
          actionToken,
          tokenType,
          user.role,
        );

        req.res.locals.jwtPayload = jwtPayload;
        req.res.locals.actionToken = actionToken;
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
export const authMiddleware = new AuthMiddleware();
