import { Router } from "express";

import { userController } from "../controllers";
import { EToken } from "../enums";
import {authMiddleware, commonMiddleware, fileMiddleware} from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();
/**
 * Функція для отримання списку користувачів.
 * @route GET /users
 * @summary Отримати список користувачів
 * @returns {Array<User>} 200 - Масив користувачів
 * @returns {Error} 500 - Помилка сервера
 */

router.get("", userController.getAllWithPagination);

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




router.post("/avatar",  fileMiddleware.isAvatarValid,authMiddleware.checkToken(EToken.AccessToken),userController.uploadAvatar);

export const userRouter = router;
