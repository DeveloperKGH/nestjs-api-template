import * as bcrypt from 'bcryptjs';

export class BcryptUtil {
  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 8);
  }

  static async match(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
