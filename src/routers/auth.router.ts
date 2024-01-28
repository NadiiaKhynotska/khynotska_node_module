import { Router } from "express";

import { authController } from "../controllers";
import { EToken } from "../enums";
import { authMiddleware, commonMiddleware } from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();

router.post(
  "/admin/register",
  commonMiddleware.isBodyValid(UserValidator.create),
  commonMiddleware.isEmailUniq,
  authController.registerAdmin,
);
router.post(
  "/register",
  commonMiddleware.isBodyValid(UserValidator.create),
  commonMiddleware.isEmailUniq,
  authController.register,
);
router.post(
  "/login",
  commonMiddleware.isBodyValid(UserValidator.login),
  authController.login,
);
router.post(
  "/refresh",
  authMiddleware.checkToken(EToken.RefreshToken),
  authController.refresh,
);
router.post(
  "/forgot-password",
  commonMiddleware.isBodyValid(UserValidator.forgotPassword),
  commonMiddleware.isUserExist("email"),
  authController.forgotPassword,
);
router.put(
  "/forgot-password/:token",
  commonMiddleware.isBodyValid(UserValidator.setForgotPassword),
  authMiddleware.checkActionToken(EToken.ForgotPassword),
  authController.setForgotPassword,
);

router.put(
  "/activate/:token",
  authMiddleware.checkActionToken(EToken.Activate),
  authController.activate,
);

export const authRouter = router;
