import { User } from "../models";
import { IUser } from "../types";
import {ApiError} from "../errors";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await User.find();
  }

  public async crete(dto: IUser): Promise<IUser> {
    return await User.create(dto);
  }
  public async findById(userId: string) {
    return await User.findById(userId);
  }

  public async updateById(userId: string, dto: Partial<IUser>) {
    return await User.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }

  public async deleteById(userId: string) {
    const { deletedCount } = await User.deleteOne({ _id: userId });
    if (!deletedCount) {
      throw new ApiError("User not found!", 404);
    }
  }
}
export const userRepository = new UserRepository();
