import { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { ApiError } from "../errors";
import { userRepository } from "../repositories";
import { UserValidator } from "../validators";

class CommonMiddleware {
  public isBodyValid(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = UserValidator.create.validate(req.body);
      if (error) {
        throw new ApiError(error.message, 400);
      }
      console.log(value);
      next();
    } catch (error) {
      next(error);
    }
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

  public isUpdateBodyValid(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = UserValidator.update.validate(req.body);
      if (error) {
        throw new ApiError(error.message, 400);
      }
      console.log(value);
      next();
    } catch (error) {
      next(error);
    }
  }

  public async isEmailUniq(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await userRepository.getOneByParams({ email });
      if (user) {
      } else {
        throw new ApiError("Email is olready exist", 409);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const commonMiddleware = new CommonMiddleware();
