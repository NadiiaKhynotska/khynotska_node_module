import { model, Schema } from "mongoose";

import { ECities, EGenders } from "../enums";

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
      lowercase: true,
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

export const User = model("user", userSchema);
