export class VerifyCodeResetPasswordServiceDto {
  private readonly _email!: string;
  private readonly _code!: string;

  private constructor(email: string, code: string) {
    this._email = email;
    this._code = code;
  }

  public static of(email: string, code: string): VerifyCodeResetPasswordServiceDto {
    return new VerifyCodeResetPasswordServiceDto(email, code);
  }

  get email(): string {
    return this._email;
  }

  get code(): string {
    return this._code;
  }
}
