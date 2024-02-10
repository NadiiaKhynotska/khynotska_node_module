import { NextFunction, Request, Response } from "express";

import { ERoles } from "../enums";
import { UserPresenter } from "../presenters";
import { userService } from "../services";
import {IQuery, ITokenPayload, IUser} from "../types";
import {UploadedFile} from "express-fileupload";

class UserController {
  public async getAllWithPagination(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const paginatedUsers = await userService.getAllWithPagination(
        req.query as IQuery,
      );

      const allowedUsers = paginatedUsers.data.filter(
        (user) => user.role === ERoles.USER,
      );

      return res.json({
        ...paginatedUsers,
        data: UserPresenter.usersToResponse(allowedUsers),
      });
    } catch (e) {
      next(e);
    }
  }

  public async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.findById(req.params.userId);
      res.json(UserPresenter.userToResponse(user));
    } catch (e) {
      next(e.message);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateById(req.params.userId, req.body);
      res.status(201).json(UserPresenter.userToResponse(user));
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteById(req.params.userId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {

      const {userId}= req.res.locals.jwtPayload as ITokenPayload
        await userService.uploadAvatar(userId, req.files.avatar as UploadedFile)
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
