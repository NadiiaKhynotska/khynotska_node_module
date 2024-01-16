import { ApiError } from "../errors";
import { userRepository } from "../repositories";
import { IUser } from "../types";

class UserService {
  public async getAll(): Promise<IUser[]> {
    const users = await userRepository.getAll();
    if (!users) {
      throw new ApiError("Users not found", 404);
    }
    return users;
  }

  public async create(dto: IUser): Promise<IUser> {
    return await userRepository.crete(dto);
  }

  public async findById(userId: string): Promise<IUser> {
    return await userRepository.findById(userId);
  }

  public async updateById(userId: string, dto: Partial<IUser>) {
    return await userRepository.updateById(userId, dto);
  }

  public async deleteById(userId: string) {
    await userRepository.deleteById(userId);
  }
}

export const userService = new UserService();
