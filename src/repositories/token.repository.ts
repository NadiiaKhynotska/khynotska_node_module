import { Token } from "../models";
import { IToken } from "../types";

class TokenRepository {
  public async create(dto: Partial<IToken>): Promise<IToken> {
    return await Token.create(dto);
  }

  public async getOneBy(param: Partial<IToken>): Promise<IToken> {
    return await Token.findOne(param);
  }

  public async deleteOneByParams(param: Partial<IToken>): Promise<void> {
    await Token.deleteOne(param);
  }
}

export const tokenRepository = new TokenRepository();
