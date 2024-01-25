import { NextFunction, Request, Response } from "express";

import { ERoles } from "../enums";
import { ApiError } from "../errors";

class UserMiddleware {
  public haveAccessByRole(...roles: ERoles[]) {
    return function (req: Request, res: Response, next: NextFunction) {
      try {
        const payload = req.res.locals.jwtPayload;
        if (!roles.includes(payload?.role)) {
          throw new ApiError("Access denied", 403);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const userMiddleware = new UserMiddleware();
