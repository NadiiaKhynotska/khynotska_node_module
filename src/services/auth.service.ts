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
      dto.role = ERoles.ADMIN;
      const createdAdmin = await userRepository.create(dto);

      const actionToken = tokenService.generateActionToken(
        {
          role: createdAdmin.role,
          userId: createdAdmin._id,
          email: createdAdmin.email,
          name: createdAdmin.name,
        },
        EToken.Activate,
      );

      await Promise.all([
        tokenRepository.createActionToken({
          actionToken,
          tokenType: EToken.Activate,
          _userId: createdAdmin._id,
        }),

        emailService.sendMail("nadinyman@gmail.com", EEmailAction.WELCOME, {
          name: createdAdmin.name,
          actionToken,
        }),
      ]);

      return createdAdmin;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }

  public async register(dto: IUser) {
    try {
      dto.password = await passwordService.hash(dto.password);
      const createdUser = await userRepository.create(dto);

      const actionToken = tokenService.generateActionToken(
        {
          role: createdUser.role,
          userId: createdUser._id,
          email: createdUser.email,
          name: createdUser.name,
        },
        EToken.Activate,
      );

      await Promise.all([
        tokenRepository.createActionToken({
          actionToken,
          tokenType: EToken.Activate,
          _userId: createdUser._id,
        }),

        emailService.sendMail("nadinyman@gmail.com", EEmailAction.WELCOME, {
          name: createdUser.name,
          actionToken,
        }),
      ]);

      return createdUser;
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

      if (!user.isActive) {
        throw new ApiError("You need activate your account", 403);
      }

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

    await Promise.all([
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

  public async activate(jwtPayload: ITokenPayload, actionToken: string) {
    try {
      await Promise.all([
        userRepository.updateById(jwtPayload.userId, {
          isActive: true,
        }),
        tokenRepository.deleteActionTokenByParams({ actionToken }),
      ]);
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
