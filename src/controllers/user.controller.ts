import { NextFunction, Request, Response } from "express";

import { ERoles } from "../enums";
import { userService } from "../services";
import { IUser } from "../types";

class UserController {
  public async getAll(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.getAll();

      const allowedUsers = users.filter((user) => user.role === ERoles.USER);

      return res.json(allowedUsers);
    } catch (e) {
      next(e);
    }
  }

  public async getByID(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.findById(req.params.userId);
      res.json(user);
    } catch (e) {
      next(e.message);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateById(req.params.userId, req.body);
      res.status(201).json(user);
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
}

export const userController = new UserController();
