import { Document } from "mongoose";

import { ECities, EGenders } from "../enums";

export interface IUser extends Document {
  name: string;
  age?: number;
  password: string;
  email: string;
  gender?: EGenders;
  address?: ECities;
}
