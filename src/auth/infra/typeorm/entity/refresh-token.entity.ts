import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { LocalDateTimeTransformer } from '../../../../global/infra/typeorm/transformer/local-date-time.transformer';
import { LocalDateTime } from '@js-joda/core';
import { Member } from '../../../../member/infra/typeorm/entity/member.entity';
import { RandomUtil } from '../../../../global/util/random.util';
import { BaseEntity } from '../../../../global/infra/typeorm/entity/base.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadServiceDto } from '../../../application/dto/token-payload.service.dto';
import { InternalServerException } from '../../../../global/exception/internal-server.exception';
import { NumberUtil } from '../../../../global/util/number.util';
import { RefreshTokenEncrypterService } from '../../../domain/service/refresh-token-encrypter.service';

@Unique('UK_member_id', ['member'])
@Entity()
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  public readonly id: number;

  @ManyToOne(() => Member, { eager: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'member_id' })
  public readonly member: Member;

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

  private constructor(member: Member, token: string, expiresAt: LocalDateTime) {
    super();
    this.member = member;
    this.token = token;
    this.expiresAt = expiresAt;
  }

  public static create(member: Member, jwtService: JwtService): RefreshToken {
    const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRE;

    if (!expiresIn) {
      throw new InternalServerException(InternalServerException.ErrorCodes.FAILED_TO_GET_SYSTEM_VARIABLE);
    }

    const token = jwtService.sign(new TokenPayloadServiceDto(RandomUtil.generateUuidV4(), member.id).toPlain(), {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      expiresIn: expiresIn,
    });

    const duration = NumberUtil.parseInt(expiresIn.replace('d', ''));

    if (!duration) {
      throw new InternalServerException(InternalServerException.ErrorCodes.FAILED_TO_GET_SYSTEM_VARIABLE);
    }

    return new RefreshToken(member, token, LocalDateTime.now().plusDays(duration));
  }

  public async hashRefreshToken(encrypter: RefreshTokenEncrypterService): Promise<void> {
    const hashedToken = await encrypter.hash(this.token);

    if (!hashedToken) {
      throw new InternalServerException(InternalServerException.ErrorCodes.FAILED_TO_HASH_REFRESH_TOKEN);
    }

    this.token = hashedToken;
  }
}