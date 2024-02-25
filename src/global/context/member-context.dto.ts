export class MemberContextDto {
  private readonly _id: number;
  private readonly _email: string;
  private readonly _jwt: string;

  private constructor(id: number, email: string, jwt: string) {
    this._id = id;
    this._email = email;
    this._jwt = jwt;
  }

  public static of(id: number, email: string, jwt: string): MemberContextDto {
    return new MemberContextDto(id, email, jwt);
  }

  get id(): number {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get jwt(): string {
    return this._jwt;
  }
}
