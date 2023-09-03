export class ResetPasswordServiceDto {
  private readonly _email!: string;
  private readonly _token!: string;
  private readonly _password!: string;

  private constructor(email: string, token: string, password: string) {
    this._email = email;
    this._token = token;
    this._password = password;
  }

  public static of(email: string, token: string, password: string): ResetPasswordServiceDto {
    return new ResetPasswordServiceDto(email, token, password);
  }

  get email(): string {
    return this._email;
  }

  get token(): string {
    return this._token;
  }

  get password(): string {
    return this._password;
  }
}
