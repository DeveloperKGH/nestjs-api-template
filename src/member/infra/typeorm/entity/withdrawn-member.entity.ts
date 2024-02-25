import { BaseTimeEntity } from '../../../../global/infra/typeorm/entity/base-time.entity';
import { MemberRole } from '../../../domain/enum/member-role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MemberRoleTransformer } from '../transformer/member-role.transformer';
import { WithdrawnMember } from '../../../domain/model/withdrawn-member.domain';
import { LocalDateTimeTransformer } from '../../../../global/infra/typeorm/transformer/local-date-time.transformer';
import { LocalDateTime } from '@js-joda/core';

@Entity({ name: 'withdrawn_member' })
export class WithdrawnMemberEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: number;

  @Column({ type: 'bigint', unsigned: true })
  public readonly memberId: number;

  @Column({ type: 'varchar', length: 320 })
  public readonly email: string;

  @Column({ type: 'varchar', length: 10, transformer: new MemberRoleTransformer() })
  public readonly role: MemberRole;

  @Column({ type: 'timestamp', transformer: new LocalDateTimeTransformer(), precision: 3 })
  public readonly joinedAt: LocalDateTime;

  private constructor(memberId: number, email: string, role: MemberRole, joinedAt: LocalDateTime, id?: number) {
    super();
    this.memberId = memberId;
    this.email = email;
    this.role = role;
    this.joinedAt = joinedAt;
    if (id) {
      this.id = id;
    }
  }
  public toDomain(): WithdrawnMember {
    return WithdrawnMember.of(this.memberId, this.email, this.role, this.joinedAt);
  }

  public static fromDomain(domain: WithdrawnMember): WithdrawnMemberEntity {
    return new WithdrawnMemberEntity(domain.memberId, domain.email, domain.role, domain.joinedAt);
  }
}
