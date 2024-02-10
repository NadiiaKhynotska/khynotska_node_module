import { Document } from "mongoose";

import { ECities, EGenders, ERoles } from "../enums";

export interface IUser extends Document {
  name: string;
  age?: number;
  password: string;
  email: string;
  isActive: boolean;
  gender?: EGenders;
  address?: ECities;
  role: ERoles;
  createdAt: Date;
  avatar: string;
}

export type IUserCredentials = Pick<IUser, "email" | "password">;
