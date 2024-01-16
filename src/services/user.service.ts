import { userRepository } from "../repositories";
import { IUser } from "../types";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
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
}

export const userService = new UserService();
