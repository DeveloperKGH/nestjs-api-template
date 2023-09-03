export class CheckEmailDuplicationServiceDto {
  private readonly _email!: string;

  private constructor(email: string) {
    this._email = email;
  }

  public static of(email: string): CheckEmailDuplicationServiceDto {
    return new CheckEmailDuplicationServiceDto(email);
  }

  get email(): string {
    return this._email;
  }
}
