import { v4 as uuid } from 'uuid';
import { StringUtil } from './string.util';
import { InternalServerException } from '../exception/internal-server.exception';

export class RandomUtil {
  public static generateUuidV4(): string {
    if (!StringUtil.removeAllHyphens(uuid())) {
      throw new InternalServerException(InternalServerException.ErrorCodes.FAILED_TO_GENERATE_UUID);
    }

    return StringUtil.removeAllHyphens(uuid()) as string;
  }

  public static generateRandomSixDigits(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
}
