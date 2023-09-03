export class ResetMyPasswordServiceDto {
  private readonly _password!: string;
  private readonly _newPassword!: string;

  private constructor(password: string, newPassword: string) {
    this._password = password;
    this._newPassword = newPassword;
  }

  public static of(password: string, newPassword: string): ResetMyPasswordServiceDto {
    return new ResetMyPasswordServiceDto(password, newPassword);
  }

  get password(): string {
    return this._password;
  }

  get newPassword(): string {
    return this._newPassword;
  }
}
