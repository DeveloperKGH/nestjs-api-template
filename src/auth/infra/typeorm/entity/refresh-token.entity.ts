import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LocalDateTimeTransformer } from '../../../../global/infra/typeorm/transformer/local-date-time.transformer';
import { LocalDateTime } from '@js-joda/core';
import { MemberEntity } from '../../../../member/infra/typeorm/entity/member.entity';
import { BaseEntity } from '../../../../global/infra/typeorm/entity/base.entity';
import { RefreshToken } from '../../../domain/model/refresh-token.domain';
import { Member } from '../../../../member/domain/model/member.domain';
import { isEmpty } from '../../../../global/util/common.util';

@Unique('UK_member_id', ['member'])
@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: number;

  @ManyToOne(() => MemberEntity, { eager: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'member_id' })
  public readonly member: MemberEntity | null;

  @Column({ type: 'varchar', length: 60 })
  public token: string;

  @Column({ type: 'timestamp', transformer: new LocalDateTimeTransformer(), precision: 3 })
  public readonly expiresAt: LocalDateTime;

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

  private constructor(member: MemberEntity | null, token: string, expiresAt: LocalDateTime, id?: number) {
    super();
    this.member = member;
    this.token = token;
    this.expiresAt = expiresAt;
    if (id) {
      this.id = id;
    }
  }

  public toDomain(): RefreshToken {
    const member: Member | null = isEmpty(this.member) ? null : this.member!.toDomain();

    return RefreshToken.of(member, this.token, this.expiresAt, this.id);
  }

  public static fromDomain(domain: RefreshToken): RefreshTokenEntity {
    const memberEntity: MemberEntity | null = isEmpty(domain.member) ? null : MemberEntity.fromDomain(domain.member!);

    return new RefreshTokenEntity(memberEntity, domain.token, domain.expiresAt, domain.id);
  }
}
