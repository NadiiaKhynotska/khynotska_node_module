import { Types } from "mongoose";

import { ERoles } from "../enums";

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenPayload {
  name: string;
  email: string;
  userId: string;
  role: ERoles;
}

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  _userId: Types.ObjectId;
}
