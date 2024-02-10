import { Router } from "express";

import { userController } from "../controllers";
import { ERoles, EToken } from "../enums";
import {
  authMiddleware,
  commonMiddleware,
  fileMiddleware,
  userMiddleware,
} from "../middlewares";
import { UserValidator } from "../validators";

const router = Router();
/**
 * Функція для отримання списку користувачів.
 * @route GET /users
 * @summary Отримати список користувачів
 * @returns {Array<User>} 200 - Масив користувачів
 * @returns {Error} 500 - Помилка сервера
 */

router.get(
  "",
  authMiddleware.checkToken(EToken.AccessToken),
  userMiddleware.haveAccessByRole(ERoles.USER),
  userController.getAllWithPagination,
);

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
  "/avatar",
  authMiddleware.checkToken(EToken.AccessToken),
  userController.deleteAvatar,
);

router.delete(
  "/:userId",
  commonMiddleware.isIdValid,
  commonMiddleware.isUserExist("_id"),
  userController.deleteById,
);

router.post(
  "/avatar",
  fileMiddleware.isAvatarValid,
  authMiddleware.checkToken(EToken.AccessToken),
  userController.uploadAvatar,
);

export const userRouter = router;
