export class SendCodeResetPasswordServiceDto {
  private readonly _email!: string;

  private constructor(email: string) {
    this._email = email;
  }

  public static of(email: string): SendCodeResetPasswordServiceDto {
    return new SendCodeResetPasswordServiceDto(email);
  }

  get email(): string {
    return this._email;
  }
}
