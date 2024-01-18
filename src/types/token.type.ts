import Types from "mongoose";

import { IUser } from "./user.type";

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenPayload {
  name: string;
  email: string;
  userId: Types.ObjectId;
}

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  _userId: Types.ObjectId | IUser;
}
