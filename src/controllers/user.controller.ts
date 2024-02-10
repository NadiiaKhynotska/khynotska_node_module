import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { UserPresenter } from "../presenters";
import { userService } from "../services";
import { IQuery, ITokenPayload, IUser } from "../types";

class UserController {
  public async getAllWithPagination(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const { role } = req.res.locals.jwtPayload as ITokenPayload;
      const paginatedUsers = await userService.getAllWithPagination(
        req.query as IQuery,
        role,
      );

      return res.json({
        ...paginatedUsers,
        data: UserPresenter.usersToResponse(paginatedUsers.data),
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
      const { userId } = req.res.locals.jwtPayload as ITokenPayload;
      await userService.uploadAvatar(userId, req.files.avatar as UploadedFile);
      res.json("OK");
    } catch (e) {
      next(e);
    }
  }

  public async deleteAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.res.locals.jwtPayload as ITokenPayload;
      await userService.deleteAvatar(userId);
      res.json("OK");
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
