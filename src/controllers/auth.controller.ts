import { NextFunction, Request, Response } from "express";

import { authService } from "../services";
import { ITokensPair } from "../types";

class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<void>> {
    try {
      const dto = req.body;
      await authService.register(dto);
      return res.sendStatus(201);
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
}

export const authController = new AuthController();
