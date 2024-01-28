import { Types } from "mongoose";

import { EEmailAction, ERoles, EToken } from "../enums";
import { ApiError } from "../errors";
import { tokenRepository, userRepository } from "../repositories";
import { ITokenPayload, ITokensPair, IUser, IUserCredentials } from "../types";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async registerAdmin(dto: IUser): Promise<IUser> {
    try {
      dto.password = await passwordService.hash(dto.password);
      await emailService.sendMail("nadinyman@gmail.com", EEmailAction.WELCOME, {
        name: dto.name,
      });

      dto.role = ERoles.ADMIN;
      return await userRepository.create(dto);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async register(dto: IUser) {
    try {
      dto.password = await passwordService.hash(dto.password);
      await emailService.sendMail("nadinyman@gmail.com", EEmailAction.WELCOME, {
        name: dto.name,
      });
      return await userRepository.create(dto);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async login(dto: IUserCredentials): Promise<ITokensPair> {
    try {
      const user = await userRepository.getOneByParams({ email: dto.email });
      if (!user) throw new ApiError("Invalid credentials", 401);

      const isMatch = await passwordService.compare(
        dto.password,
        user.password,
      );
      if (!isMatch) throw new ApiError("Invalid credentials", 401);

      const tokensPair = tokenService.generateTokensPair(
        {
          name: user.name,
          email: user.email,
          userId: user._id,
          role: user.role,
        },
        user.role,
      );

      await tokenRepository.create({ ...tokensPair, _userId: user._id });

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async refresh(
    payload: ITokenPayload,
    refreshToken: string,
  ): Promise<ITokensPair> {
    await tokenRepository.deleteOneByParams({ refreshToken });

    const tokensPair = tokenService.generateTokensPair(
      {
        name: payload.name,
        email: payload.email,
        userId: payload.userId,
        role: payload.role,
      },
      payload.role,
    );

    await tokenRepository.create({
      ...tokensPair,
      _userId: new Types.ObjectId(payload.userId),
    });

    return tokensPair;
  }

  public async forgotPassword(user: IUser) {
    const actionToken = tokenService.generateActionToken(
      { role: user.role, userId: user._id, email: user.email, name: user.name },
      EToken.ForgotPassword,
    );

    Promise.all([
      tokenRepository.createActionToken({
        actionToken,
        tokenType: EToken.ForgotPassword,
        _userId: user._id,
      }),

      emailService.sendMail(user.email, EEmailAction.FORGOT_PASSWORD, {
        name: user.name,
        actionToken,
      }),
    ]);
  }

  public async setForgotPassword(
    newPassword: string,
    jwtPayload: ITokenPayload,
    actionToken: string,
  ) {
    try {
      const newHashedPassword = await passwordService.hash(newPassword);
      await Promise.all([
        userRepository.updateById(jwtPayload.userId, {
          password: newHashedPassword,
        }),
        tokenRepository.deleteActionTokenByParams({ actionToken }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
