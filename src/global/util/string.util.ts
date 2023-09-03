export class StringUtil {
  private static readonly HYPHEN_REGEXP = new RegExp('-', 'g');

  public static isEmpty(value: string | null | undefined): boolean {
    return !value || value.trim() === '';
  }

  public static reverse(value: string | null | undefined): string | null {
    if (this.isEmpty(value)) {
      return null;
    }

    value = value as string;

    return value.split('').reverse().join('');
  }

  public static removeAllHyphens(value: string): string | null {
    if (!value) {
      return null;
    }

    return value.replace(StringUtil.HYPHEN_REGEXP, '');
  }

  public static fromNumber(value: number): string | null {
    if (!value) {
      return null;
    }

    return value.toString();
  }

  public static split(value: string, delimiter: string): string[] | null {
    if (!value) {
      return null;
    }

    return value.split(delimiter);
  }
}
