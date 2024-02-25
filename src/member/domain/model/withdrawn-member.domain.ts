import { MemberRole } from '../enum/member-role.enum';
import { MemberCommandRepository } from '../repository/member-command.repository';
import { Member } from './member.domain';
import { LocalDateTime } from '@js-joda/core';

export class WithdrawnMember {
  private readonly _id: number | undefined;

  private readonly _memberId: number;

  private readonly _email: string;

  private readonly _role: MemberRole;

  private readonly _joinedAt: LocalDateTime;

  private constructor(memberId: number, email: string, role: MemberRole, joinedAt: LocalDateTime, id?: number) {
    this._memberId = memberId;
    this._email = email;
    this._role = role;
    this._joinedAt = joinedAt;
    this._id = id;
  }

  public static of(
    memberId: number,
    email: string,
    role: MemberRole,
    joinedAt: LocalDateTime,
    id?: number,
  ): WithdrawnMember {
    return new WithdrawnMember(memberId, email, role, joinedAt, id);
  }

  public static async withdrawFromMember(
    member: Member,
    repository: MemberCommandRepository,
  ): Promise<WithdrawnMember> {
    const withdrawnMember = WithdrawnMember.of(member.id!, member.email, member.role, member.createdAt);

    await repository.remove(member);

    return withdrawnMember;
  }

  get id(): number | undefined {
    return this._id;
  }

  get memberId(): number {
    return this._memberId;
  }

  get email(): string {
    return this._email;
  }

  get role(): MemberRole {
    return this._role;
  }

  get joinedAt(): LocalDateTime {
    return this._joinedAt;
  }
}
