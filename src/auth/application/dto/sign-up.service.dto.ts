export class SignUpServiceDto {
  private readonly _email!: string;
  private readonly _password!: string;

  private constructor(email: string, password: string) {
    this._email = email;
    this._password = password;
  }

  public static of(email: string, password: string): SignUpServiceDto {
    return new SignUpServiceDto(email, password);
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }
}
