import { MemberRole } from '../../../member/domain/enum/member-role.enum';

export class TokenPayloadServiceDto {
  readonly id: string;
  readonly memberId: number;
  readonly email?: string;
  readonly role?: string;

  constructor(id: string, memberId: number, email?: string, role?: MemberRole) {
    this.id = id;
    this.memberId = memberId;
    this.email = email;
    this.role = role?.enumName;
  }

  toPlain(): { id: string; memberId: number; email?: string; role?: string } {
    return {
      id: this.id,
      memberId: this.memberId,
      email: this.email,
      role: this.role,
    };
  }
}
