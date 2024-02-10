import { FilterQuery } from "mongoose";

import { User } from "../models";
import { IPaginationResponse, IQuery, IUser } from "../types";

class UserRepository {
  public async getAllWithPagination(
    query: IQuery,
  ): Promise<IPaginationResponse<IUser>> {
    const {
      page = 1,
      sortedBy = "createdAt",
      limit = 10,
      ...searchObj
    } = query;

    const skip = Number(limit) * (Number(page) - 1);

    const users = await User.find(searchObj)
      .sort(sortedBy)
      .limit(Number(limit))
      .skip(skip);

    const itemsFound = await User.countDocuments(searchObj);

    return {
      page: Number(page),
      limit: Number(limit),
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
