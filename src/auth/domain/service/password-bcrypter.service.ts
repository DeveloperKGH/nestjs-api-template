import { Injectable } from '@nestjs/common';
import { BcryptUtil } from '../../../global/util/bcrypt.util';
import { PasswordEncrypterService } from './password-encrypter.service';

@Injectable()
export class PasswordBcrypterService implements PasswordEncrypterService {
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
