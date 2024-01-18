import * as bcrypt from "bcrypt";

import { configs } from "../configs";

class PasswordService {
  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, configs.SECRET_SALT);
  }
  public compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}

export const passwordService = new PasswordService();
