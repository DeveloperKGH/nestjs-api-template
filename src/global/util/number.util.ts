import { StringUtil } from './string.util';

export class NumberUtil {
  public static parseInt(value: string | null | undefined): number | null {
    if (StringUtil.isEmpty(value)) {
      return null;
    }

    value = value as string;

    return parseInt(value);
  }

  public static isNumber(value: number): boolean {
    return isNaN(value);
  }
}
