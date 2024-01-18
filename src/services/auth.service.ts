import { ApiError } from "../errors";
import { tokenRepository, userRepository } from "../repositories";
import { ITokensPair, IUser, IUserCredentials } from "../types";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(dto: IUser) {
    try {
      dto.password = await passwordService.hash(dto.password);

      await userRepository.create(dto);
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

      const tokensPair = tokenService.generateTokensPair({
        name: user.name,
        email: user.email,
        userId: user._id,
      });

      await tokenRepository.create({ ...tokensPair, _userId: user._id });

      return tokensPair;
    } catch (e) {
      throw new ApiError(e.message, e.status);
    }
  }
}

export const authService = new AuthService();
