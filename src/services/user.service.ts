import { UploadedFile } from "express-fileupload";

import { EFileType, ERoles } from "../enums";
import { userRepository } from "../repositories";
import { IPaginationResponse, IQuery, IUser } from "../types";
import { s3Service } from "./s3.service";

class UserService {
  public async getAllWithPagination(
    query: IQuery,
    role: ERoles,
  ): Promise<IPaginationResponse<IUser>> {
    const queryString = JSON.stringify(query);
    const queryObj = JSON.parse(
      queryString.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`),
    );

    return await userRepository.getAllWithPagination(queryObj, role);
  }

  public async create(dto: IUser): Promise<IUser> {
    return await userRepository.create(dto);
  }

  public async findById(userId: string): Promise<IUser> {
    return await userRepository.findById(userId);
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await userRepository.updateById(userId, dto);
  }

  public async deleteById(userId: string): Promise<void> {
    await userRepository.deleteById(userId);
  }

  public async uploadAvatar(
    userId: string,
    avatar: UploadedFile,
  ): Promise<void> {
    const user = await userRepository.getOneByParams({ _id: userId });
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    const filePath = await s3Service.uploadFile(userId, avatar, EFileType.User);
    await userRepository.updateById(userId, { avatar: filePath });
  }

  public async deleteAvatar(userId: string): Promise<void> {
    const user = await userRepository.getOneByParams({ _id: userId });
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    await userRepository.updateById(userId, { avatar: null });
  }
}

export const userService = new UserService();
