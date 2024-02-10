import { userRepository } from "../repositories";
import { IPaginationResponse, IQuery, IUser } from "../types";
import {UploadedFile} from "express-fileupload";

class UserService {
  public async getAllWithPagination(
    query: IQuery,
  ): Promise<IPaginationResponse<IUser>> {
    const queryString = JSON.stringify(query);
    const queryObj = JSON.parse(
      queryString.replace(/\b(gte|lte|gt|lt)\b/, (match) => `$${match}`),
    );

    return await userRepository.getAllWithPagination(queryObj);
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

  public async uploadAvatar(userId: string, avatar: UploadedFile): Promise<void> {
    await userRepository.deleteById(userId);
  }
}

export const userService = new UserService();
