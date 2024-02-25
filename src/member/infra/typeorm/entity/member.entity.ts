import { BaseTimeEntity } from '../../../../global/infra/typeorm/entity/base-time.entity';
import { MemberRole } from '../../../domain/enum/member-role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MemberRoleTransformer } from '../transformer/member-role.transformer';
import { Member } from '../../../domain/model/member.domain';
import { LocalDateTime } from '@js-joda/core';

@Entity({ name: 'member' })
export class MemberEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: number;

  @Column({ type: 'varchar', length: 320 })
  public readonly email: string;

  @Column({ type: 'varchar', length: 60 })
  public password: string | null;

  @Column({ type: 'varchar', length: 10, transformer: new MemberRoleTransformer() })
  public readonly role: MemberRole;

  private constructor(email: string, password: string | null, role: MemberRole, createdAt: LocalDateTime);

  private constructor(email: string, password: string | null, role: MemberRole, createdAt: LocalDateTime, id?: number);

  private constructor(email: string, password: string | null, role: MemberRole, createdAt: LocalDateTime, id?: number) {
    super();
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    if (id) {
      this.id = id;
    }
  }

  public toDomain(): Member {
    return Member.of(this.email, this.password, this.role, this.createdAt, this.id);
  }

  public static fromDomain(domain: Member): MemberEntity {
    return new MemberEntity(domain.email, domain.password, domain.role, domain.createdAt, domain.id);
  }
}
