import { NextFunction, Request, Response } from "express";

import { authService } from "../services";
import { IChangePassword, ITokenPayload, ITokensPair, IUser } from "../types";

class AuthController {
  public async registerAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const dto = req.body;
      const createdAdmin = await authService.registerAdmin(dto);
      return res.json({ data: createdAdmin }).status(201);
    } catch (e) {
      next(e);
    }
  }
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const dto = req.body;
      const createdUser = await authService.register(dto);
      return res.json({ data: createdUser });
    } catch (e) {
      next(e);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const tokensPair = await authService.login(req.body);

      return res.json(tokensPair);
    } catch (e) {
      next(e);
    }
  }

  public async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ITokensPair>> {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const refreshToken = req.res.locals.token as string;

      const tokensPair = await authService.refresh(jwtPayload, refreshToken);

      return res.json(tokensPair);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<boolean> {
    try {
      const user = req.res.locals as IUser;

      await authService.forgotPassword(user);
      return true;
    } catch (e) {
      next(e);
    }
  }
  public async setForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const jwtPayload = req.res.locals.jwtPayload;
      const newPassword = req.body.password;
      const actionToken = req.res.locals.actionToken;

      await authService.setForgotPassword(newPassword, jwtPayload, actionToken);

      res.sendStatus(201);
    } catch (e) {
      next(e);
    }
  }

  public async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload;
      const actionToken = req.res.locals.actionToken;

      await authService.activate(jwtPayload, actionToken);

      res.sendStatus(201);
    } catch (e) {
      next(e);
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload;
      const dto = req.body as IChangePassword;

      await authService.changePassword(jwtPayload, dto);

      res.sendStatus(201);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
