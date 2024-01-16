import { Router } from "express";

import { userController } from "../controllers";
import { commonMiddleware } from "../middlewares";

const router = Router();

router.get("", userController.getAll);

router.post("", commonMiddleware.isBodyValid, userController.create);

router.get("/:userId", commonMiddleware.isIdValid, userController.getByID);

router.put(
  "/:userId",
  commonMiddleware.isIdValid,
  commonMiddleware.isUpdateBodyValid,
  userController.updateById,
);

router.delete(
  "/:userId",
  commonMiddleware.isIdValid,
  userController.deleteById,
);

export const userRouter = router;
