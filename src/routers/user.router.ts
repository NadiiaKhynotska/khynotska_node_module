import { Router } from "express";

import { userController } from "../controllers";
import { EToken } from "../enums";
import { authMiddleware, commonMiddleware } from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();

router.get("", userController.getAll);

router.get(
  "/:userId",
  commonMiddleware.isIdValid,
  commonMiddleware.isUserExist("_id"),
  userController.getByID,
);

router.put(
  "/:userId",
  authMiddleware.checkToken(EToken.AccessToken),
  commonMiddleware.isIdValid,
  commonMiddleware.isUserExist("_id"),
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateById,
);

router.delete(
  "/:userId",
  commonMiddleware.isIdValid,
  commonMiddleware.isUserExist("_id"),
  userController.deleteById,
);

export const userRouter = router;
