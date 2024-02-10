import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./configs";
import { runAllCronJobs } from "./crons";
import { ApiError } from "./errors";
import { adminRouter, authRouter, userRouter } from "./routers";
import { initSwagger } from "./swagger";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin operations
 */
app.use("/admins", adminRouter);
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User operations
 */

app.use("/users", userRouter);
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication operations
 */
app.use("/auth", authRouter);
initSwagger(app);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message, status: err.status });
});

app.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  runAllCronJobs();
  console.log(`App started on PORT - ${configs.PORT}`);
});
