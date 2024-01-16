import { User } from "../models";
import { IUser } from "../types";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await User.find();
  }

  public async create(dto: IUser): Promise<IUser> {
    return await User.create(dto);
  }
  public async findById(userId: string) {
    return await User.findById(userId);
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }

  public async deleteById(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }

  public async getOneByParams(email: Partial<IUser>): Promise<IUser> {
    return await User.findOne({ email });
  }
}
export const userRepository = new UserRepository();
