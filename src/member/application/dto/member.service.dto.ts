import { Member } from '../../domain/model/member.domain';
import { MemberRole } from '../../domain/enum/member-role.enum';

export class MemberServiceDto {
  private readonly _id!: number;

  private readonly _email!: string;

  private readonly _password!: string;

  private readonly _name: string | null;

  private readonly _role!: MemberRole;

  private constructor(id: number, email: string, password: string, name: string | null, role: MemberRole) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._name = name;
    this._role = role;
  }

  public static fromDomain(member: Member): MemberServiceDto {
    return new MemberServiceDto(member.id!, member.email, member.password, member.name, member.role);
  }

  get id(): number {
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
}
