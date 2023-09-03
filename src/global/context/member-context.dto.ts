export class MemberContextDto {
  private readonly _id: number;
  private readonly _email: string;

  private constructor(id: number, email: string) {
    this._id = id;
    this._email = email;
  }

  public static of(id: number, email: string): MemberContextDto {
    return new MemberContextDto(id, email);
  }

  get id(): number {
    return this._id;
  }

  get email(): string {
    return this._email;
  }
}
