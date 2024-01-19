import { Types } from "mongoose";

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenPayload {
  name: string;
  email: string;
  userId: string;
}

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  _userId: Types.ObjectId;
}
