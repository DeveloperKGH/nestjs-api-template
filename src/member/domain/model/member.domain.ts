import { MemberRole } from '../enum/member-role.enum';
import { PasswordEncrypterService } from '../../../auth/domain/service/password-encrypter.service';
import { LocalDateTime } from '@js-joda/core';

export class Member {
  private readonly _id: number | undefined;

  private readonly _email: string;

  private _password: string;

  private _name: string | null;

  private readonly _role: MemberRole;

  private readonly _createdAt: LocalDateTime;

  private constructor(email: string, password: string, name: string | null, role: MemberRole, createdAt: LocalDateTime);

  private constructor(
    email: string,
    password: string,
    name: string | null,
    role: MemberRole,
    createdAt: LocalDateTime,
    id?: number,
  );

  private constructor(
    email: string,
    password: string,
    name: string | null,
    role: MemberRole,
    createdAt: LocalDateTime,
    id?: number,
  ) {
    this._email = email;
    this._password = password;
    this._name = name;
    this._role = role;
    this._createdAt = createdAt;
    this._id = id;
  }

  public static of(
    email: string,
    password: string,
    name: string | null,
    role: MemberRole,
    createdAt: LocalDateTime,
    id: number,
  ): Member {
    return new Member(email, password, name, role, createdAt, id);
  }

  public static async signUpMember(
    email: string,
    password: string,
    encrypter: PasswordEncrypterService,
  ): Promise<Member> {
    const hashedPassword = (await encrypter.hash(password)) as string;
    return new Member(email, hashedPassword, null, MemberRole.MEMBER, LocalDateTime.now());
  }

  public async isMatchPassword(password: string, encrypter: PasswordEncrypterService): Promise<boolean> {
    return await encrypter.match(password, this.password);
  }

  public isEqualToEmail(email: string): boolean {
    return this.email === email;
  }

  public async resetPassword(password: string, encrypter: PasswordEncrypterService): Promise<void> {
    this._password = (await encrypter.hash(password)) as string;
  }

  public update(name: string | undefined) {
    if (name !== undefined) {
      this._name = name;
    }
  }

  get id(): number | undefined {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get name(): string | null {
    return this._name;
  }

  get role(): MemberRole {
    return this._role;
  }

  get createdAt(): LocalDateTime {
    return this._createdAt;
  }
}
