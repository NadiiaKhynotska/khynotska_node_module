import { NextFunction, Request, Response } from "express";

import { ERoles } from "../enums";
import { UserPresenter } from "../presenters";
import { userService } from "../services";
import { IQuery } from "../types";

class AdminController {
  public async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const paginatedUsers = await userService.getAllWithPagination(
        req.query as IQuery,
      );

      const admins = paginatedUsers.data.filter(
        (user) => user.role === ERoles.ADMIN,
      );

      return res.json({
        ...paginatedUsers,
        data: UserPresenter.usersToResponse(admins),
      });
    } catch (e) {
      next(e);
    }
  }
}

export const adminController = new AdminController();
