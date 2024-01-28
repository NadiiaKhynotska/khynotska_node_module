import { ActionToken, Token } from "../models";
import { IActionToken, IToken } from "../types";

class TokenRepository {
  public async create(dto: Partial<IToken>): Promise<IToken> {
    return await Token.create(dto);
  }

  public async getOneBy(param: Partial<IToken>): Promise<IToken> {
    return await Token.findOne(param);
  }

  public async getOneActionTokenBy(
    param: Partial<IActionToken>,
  ): Promise<IActionToken> {
    return await ActionToken.findOne(param);
  }

  public async deleteOneByParams(param: Partial<IToken>): Promise<void> {
    await Token.deleteOne(param);
  }

  public async createActionToken(
    data: Partial<IActionToken>,
  ): Promise<IActionToken> {
    return await ActionToken.create(data);
  }

  public async deleteActionTokenByParams(
    params: Partial<IActionToken>,
  ): Promise<void> {
    await ActionToken.deleteOne(params);
  }
}

export const tokenRepository = new TokenRepository();
