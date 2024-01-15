import * as path from "node:path";

import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import express, { NextFunction, Request, Response } from "express";
import { engine } from "express-handlebars";
import * as Handlebars from "handlebars";
import * as mongoose from "mongoose";

import { configs } from "./configs";
import { ApiError } from "./errors";
import { User } from "./models";
import { UserValidator } from "./validators";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), "static")));
app.set("view engine", ".hbs");

app.engine(
  ".hbs",
  engine({
    defaultLayout: false,
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  }),
);
app.set("views", path.join(process.cwd(), "static"));

let errorState = "";

app.get("/login", async (_req: Request, res: Response, _next: NextFunction) => {
  res.render("login");
});
app.get(
  "/register",
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.render("register");
  },
);
app.post("/register", async (req: Request, res: Response) => {
  try {
    const { error, value } = UserValidator.create.validate(req.body);
    if (error) {
      throw new ApiError(error.message, 400);
    }
    await User.create(value);
    res.redirect("login");
  } catch (e) {
    errorState = e.message;
    res.redirect("/error");
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { error, value } = UserValidator.login.validate(req.body);
    if (error) {
      throw new ApiError(error.message, 400);
    }
    const user = await User.findOne({ email: value.email });
    if (!user || user.password !== value.password) {
      throw new ApiError("User not found", 404);
    }
    res.redirect("/users");
  } catch (e) {
    errorState = e.message;
    res.redirect("/error");
  }
});

app.get("/users", async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const users = await User.find();
    console.log(users);
    res.render("users", { users });
  } catch (e) {
    res.redirect("/error");
  }
});

app.get("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isObjectIdOrHexString(userId)) {
      throw new ApiError("Invalid id", 400);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    res.render("chosenUser", { user });
  } catch (e) {
    errorState = e.message;
    res.redirect("/error");
  }
});

app.get("/error", async (_req: Request, res: Response) => {
  res.render("error", { errorState });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json(err.message);
});

app.listen(configs.PORT, async () => {
  await mongoose.connect(configs.DB_URI);
  console.log(`App started on PORT - ${configs.PORT}`);
});
