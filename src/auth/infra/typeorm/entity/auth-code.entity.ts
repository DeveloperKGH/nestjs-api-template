import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LocalDateTimeTransformer } from '../../../../global/infra/typeorm/transformer/local-date-time.transformer';
import { LocalDateTime } from '@js-joda/core';
import { MemberEntity } from '../../../../member/infra/typeorm/entity/member.entity';
import { AuthCodeTypeTransformer } from '../transformer/auth-code-type.transformer';
import { AuthCodeType } from '../../../domain/enum/auth-code-type.enum';
import { BooleanTransformer } from '../../../../global/infra/typeorm/transformer/boolean.transformer';
import { BaseEntity } from '../../../../global/infra/typeorm/entity/base.entity';
import { AuthCode } from '../../../domain/model/auth-code.domain';
import { Member } from '../../../../member/domain/model/member.domain';
import { isEmpty } from '../../../../global/util/common.util';

@Entity({ name: 'auth_code' })
export class AuthCodeEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: number;

  @ManyToOne(() => MemberEntity, { eager: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'member_id' })
  public readonly member: MemberEntity | null;

  @Column({ type: 'varchar', length: 30, transformer: new AuthCodeTypeTransformer() })
  public readonly type: AuthCodeType;

  @Column({ type: 'varchar', length: 50 })
  public readonly code: string;

  @Column({ type: 'timestamp', transformer: new LocalDateTimeTransformer(), precision: 3 })
  public readonly expiresAt: LocalDateTime;

  @Column({ type: 'tinyint', default: false, transformer: new BooleanTransformer() })
  public isVerified: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(3)',
    transformer: new LocalDateTimeTransformer(),
    precision: 3,
  })
  public createdAt: LocalDateTime;

  @BeforeInsert()
  protected beforeInsert() {
    this.createdAt = LocalDateTime.now();
  }

  private constructor(
    member: MemberEntity | null,
    type: AuthCodeType,
    code: string,
    expiresAt: LocalDateTime,
    isVerified: boolean,
    id?: number,
  ) {
    super();
    this.member = member;
    this.type = type;
    this.code = code;
    this.expiresAt = expiresAt;
    this.isVerified = isVerified;
    if (id) {
      this.id = id;
    }
  }

  public toDomain(): AuthCode {
    const member: Member | null = isEmpty(this.member) ? null : this.member!.toDomain();

    return AuthCode.of(member, this.type, this.code, this.expiresAt, this.isVerified, this.id);
  }

  public static fromDomain(domain: AuthCode): AuthCodeEntity {
    const memberEntity: MemberEntity | null = isEmpty(domain.member) ? null : MemberEntity.fromDomain(domain.member!);

    return new AuthCodeEntity(memberEntity, domain.type, domain.code, domain.expiresAt, domain.isVerified, domain.id);
  }
}
