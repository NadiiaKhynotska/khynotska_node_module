import { configs } from "../configs";
import { IUser } from "../types";

export class UserPresenter {
  public static userToResponse(user: IUser) {
    return {
      name: user.name,
      age: user.age,
      email: user.email,
      isActive: user.isActive,
      gender: user.gender,
      address: user.address,
      role: user.role,
      avatar: user?.avatar ? `${configs.AWS_S3_URL}/${user?.avatar}` : null,
      createdAt: user?.createdAt,
    };
  }

  public static usersToResponse(users: IUser[]) {
    return users.map((user) => this.userToResponse(user));
  }
}
