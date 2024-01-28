import { model, Schema, Types } from "mongoose";

import { EToken } from "../enums";
import { IActionToken } from "../types";
import { User } from "./User.model";

const actionTokenSchema = new Schema(
  {
    actionToken: {
      type: String,
      required: true,
    },
    _userId: {
      type: Types.ObjectId,
      ref: User,
    },
    tokenType: {
      enum: EToken,
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ActionToken = model<IActionToken>(
  "actionToken",
  actionTokenSchema,
);
