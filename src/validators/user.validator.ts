import joi from "joi";

import { regexConstant } from "../constants";
import { ECities, EGenders } from "../enums";

export class UserValidator {
  static firstName = joi.string().min(3).max(50).trim();
  static age = joi.number().min(18).max(130);
  static password = joi.string().regex(regexConstant.PASSWORD).trim();
  static email = joi.string().regex(regexConstant.EMAIL).trim();
  static gender = joi.valid(...Object.values(EGenders));
  static address = joi.valid(...Object.values(ECities));

  //validation rules on creating user
  static create = joi.object({
    name: this.firstName.required(),
    age: this.age.required(),
    password: this.password.required(),
    email: this.email.required(),
    gender: this.gender.required(),
    address: this.address.required(),
  });

  //validation rules on creating user
  static update = joi.object({
    name: this.firstName,
    age: this.age,
    address: this.address,
  });

  static login = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  static forgotPassword = joi.object({
    email: this.email.required(),
  });

  static setForgotPassword = joi.object({
    password: this.password.required(),
  });

  static changePassword = joi.object({
    oldPassword: this.password.required(),
    newPassword: this.password.required(),
  });
}
