import { NextFunction, Request, Response } from "express";

import { UserPresenter } from "../presenters";
import { userService } from "../services";
import { IQuery, ITokenPayload } from "../types";

class AdminController {
  public async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const { role } = req.res.locals.jwtPayload as ITokenPayload;
      const paginatedUsers = await userService.getAllWithPagination(
        req.query as IQuery,
        role,
      );

      // const allowedUsers = paginatedUsers.data.filter(
      //   (user) => user.role === ERoles.ADMIN,
      // );
      // const allowedUsersCount = allowedUsers.length;

      return res.json({
        ...paginatedUsers,
        data: UserPresenter.usersToResponse(paginatedUsers.data),
        // itemsFound: allowedUsersCount,
      });
    } catch (e) {
      next(e);
    }
  }
}

export const adminController = new AdminController();
