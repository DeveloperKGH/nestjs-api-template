import { BaseTimeEntity } from '../../../../global/infra/typeorm/entity/base-time.entity';
import { MemberRole } from '../../../domain/enum/member-role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MemberRoleTransformer } from '../transformer/member-role.transformer';
import { Member } from './member.entity';
import { MemberCommandRepository } from '../../../domain/repository/member-command.repository';

@Entity()
export class WithdrawnMember extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: number;

  @Column({ type: 'bigint', unsigned: true })
  public readonly memberId: number;

  @Column({ type: 'varchar', length: 320 })
  public readonly email: string;

  @Column({ type: 'varchar', length: 10, transformer: new MemberRoleTransformer() })
  public readonly role: MemberRole;

  private constructor(memberId: number, email: string, role: MemberRole) {
    super();
    this.memberId = memberId;
    this.email = email;
    this.role = role;
  }
  public static of(memberId: number, email: string, role: MemberRole): WithdrawnMember {
    return new WithdrawnMember(memberId, email, role);
  }

  public static async withdrawFromMember(
    member: Member,
    repository: MemberCommandRepository,
  ): Promise<WithdrawnMember> {
    const withdrawnMember = WithdrawnMember.of(member.id, member.email, member.role);

    await repository.remove(member);

    return withdrawnMember;
  }
}
