import { Injectable } from '@nestjs/common';
import { BcryptUtil } from '../../global/util/bcrypt.util';
import { RefreshTokenEncrypter } from './refresh-token-encrypter.service';

@Injectable()
export class RefreshTokenBcrypter implements RefreshTokenEncrypter {
  async hash(token: string): Promise<string | null> {
    return await BcryptUtil.hash(token);
  }

  async match(token: string, hashedToken: string | null): Promise<boolean> {
    if (!hashedToken) {
      return token === hashedToken;
    }

    return await BcryptUtil.match(token, hashedToken);
  }
}
