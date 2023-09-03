import { Injectable } from '@nestjs/common';
import { BcryptUtil } from '../../global/util/bcrypt.util';
import { PasswordEncrypter } from './password-encrypter.service';

@Injectable()
export class PasswordBcrypter implements PasswordEncrypter {
  async hash(password: string): Promise<string | null> {
    return await BcryptUtil.hash(password);
  }

  async match(password: string, hashedPassword: string | null): Promise<boolean> {
    if (!hashedPassword) {
      return password === hashedPassword;
    }

    return await BcryptUtil.match(password, hashedPassword);
  }
}
