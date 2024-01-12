import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs";
import { ApiError } from "./errors";
import { User } from "./models";
import { IUser } from "./types";
import { UserValidator } from "./validators";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
  "/users",
  async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  },
);

app.post(
  "/users",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = UserValidator.create.validate(req.body);
      if (error) {
        throw new ApiError(error.message, 400);
      }
      const createdUser = await User.create(value);
      res.status(201).json(createdUser);
    } catch (e) {
      next(e);
    }
  },
);

app.get(
  "/users/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      if (!mongoose.isObjectIdOrHexString(userId)) {
        throw new ApiError("Invalid id", 400);
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError("User not found!", 404);
      }
      res.json(user);
    } catch (e) {
      next(e.message);
    }
  },
);

app.put(
  "/users/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      if (!mongoose.isObjectIdOrHexString(userId)) {
        throw new ApiError("Invalid id", 400);
      }
      const { error, value } = UserValidator.update.validate(req.body);
      if (error) {
        throw new ApiError(error.message, 400);
      }
      const user = await User.findByIdAndUpdate(userId, value, {
        returnDocument: "after",
      });
      if (!user) {
        throw new ApiError("User not found!", 404);
      }

      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },
);

app.delete(
  "/users/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      if (!mongoose.isObjectIdOrHexString(userId)) {
        throw new ApiError("Invalid id", 400);
      }
      const { deletedCount } = await User.deleteOne({ _id: userId });
      if (!deletedCount) {
        throw new ApiError("User not found!", 404);
      }
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  },
);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json(err.message);
});

app.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  console.log(`App started on PORT - ${configs.PORT}`);
});
