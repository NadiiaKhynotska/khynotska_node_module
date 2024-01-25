import { Router } from "express";

import { adminController } from "../controllers";
import { ERoles, EToken } from "../enums";
import { authMiddleware } from "../middlewares";
import { userMiddleware } from "../middlewares/user.middleware";

const router = Router();

router.get(
  "",
  authMiddleware.checkToken(EToken.AccessToken),
  userMiddleware.haveAccessByRole(ERoles.ADMIN),
  adminController.getAdmins,
);

export const adminRouter = router;
