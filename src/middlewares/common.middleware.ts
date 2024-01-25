import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import * as mongoose from "mongoose";

import { ApiError } from "../errors";
import { userRepository } from "../repositories";

class CommonMiddleware {
  public isBodyValid(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const { error, value } = validator.validate(req.body);
        if (error) {
          throw new ApiError(error.details[0].message, 400);
        }
        req.body = value;
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public async isIdValid(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      if (!mongoose.isObjectIdOrHexString(userId)) {
        throw new ApiError("Invalid id", 400);
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  public async isUserExist(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new ApiError("User not found!", 404);
      }
      next();
    } catch (e) {
      next(e);
    }
  }

  public async isEmailUniq(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await userRepository.getOneByParams({ email });
      if (user) {
        throw new ApiError("Email is already exist", 409);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();
