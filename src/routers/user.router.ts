import { Router } from "express";

import { userController } from "../controllers";
import { commonMiddleware } from "../middlewares";

const router = Router();

router.get("", userController.getAll);

router.post(
  "",
  commonMiddleware.isBodyValid,
  commonMiddleware.isEmailUniq,
  userController.create,
);

router.get(
  "/:userId",
  commonMiddleware.isIdValid,
  commonMiddleware.isUserExist,
  userController.getByID,
);

router.put(
  "/:userId",
  commonMiddleware.isIdValid,
  commonMiddleware.isUserExist,
  commonMiddleware.isUpdateBodyValid,
  userController.updateById,
);

router.delete(
  "/:userId",
  commonMiddleware.isIdValid,
  commonMiddleware.isUserExist,
  userController.deleteById,
);

export const userRouter = router;
