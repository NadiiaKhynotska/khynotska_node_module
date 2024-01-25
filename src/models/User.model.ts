import { model, Schema } from "mongoose";

import { ECities, EGenders, ERoles } from "../enums";
import { IUser } from "../types";

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    age: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // lowercase: true,
      // select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: EGenders,
    },
    role: {
      type: String,
      enum: ERoles,
      default: ERoles.USER,
    },
    address: {
      type: String,
      enum: ECities,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("user", userSchema);
