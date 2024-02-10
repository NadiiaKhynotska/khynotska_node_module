import { FilterQuery } from "mongoose";

import { ERoles } from "../enums";
import { User } from "../models";
import { IPaginationResponse, IQuery, IUser } from "../types";

class UserRepository {
  public async getAllWithPagination(
    query: IQuery,
    role: ERoles,
  ): Promise<IPaginationResponse<IUser>> {
    const {
      page = 1,
      limit = 10,
      sortedBy = "createdAt",
      ...searchObject
    } = query;

    const skip = +limit * (+page - 1);

    const users = await User.find({ ...searchObject, role })
      .sort(sortedBy)
      .limit(limit)
      .skip(skip);

    const itemsFound = await User.countDocuments({
      ...searchObject,
      role,
    });
    return {
      page: +page,
      limit: +limit,
      itemsFound,
      data: users,
    };
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

  public async getOneByParams(params: FilterQuery<IUser>): Promise<IUser> {
    return await User.findOne(params);
  }
}
export const userRepository = new UserRepository();
