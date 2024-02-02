import { NextFunction, Request, Response } from "express";

import { ERoles } from "../enums";
import { UserPresenter } from "../presenters";
import { userService } from "../services";
import { IUser } from "../types";

class AdminController {
  public async getAdmins(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.getAll();

      const admins = users.filter((user) => user.role === ERoles.ADMIN);

      return res.json(UserPresenter.usersToResponse(admins));
    } catch (e) {
      next(e);
    }
  }
}

export const adminController = new AdminController();
