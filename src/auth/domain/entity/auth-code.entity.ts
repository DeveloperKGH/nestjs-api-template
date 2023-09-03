import { BeforeInsert, Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { LocalDateTimeTransformer } from '../../../global/common/infra/transformer/local-date-time.transformer';
import { LocalDateTime } from '@js-joda/core';
import { Member } from '../../../member/domain/entity/member.entity';
import { AuthCodeTypeTransformer } from '../../infra/transformer/auth-code-type.transformer';
import { AuthCodeType } from '../enum/auth-code-type.enum';
import { RandomUtil } from '../../../global/util/random.util';
import { StringUtil } from '../../../global/util/string.util';
import { InternalServerException } from '../../../global/exception/internal-server.exception';
import { BadRequestException } from '../../../global/exception/bad-request.exception';
import { BooleanTransformer } from '../../../global/common/infra/transformer/boolean.transformer';
import { BigintTransformer } from '../../../global/common/infra/transformer/bigint.transformer';
import { BaseEntity } from '../../../global/common/domain/entity/base.entity';

@Entity()
export class AuthCode extends BaseEntity {
  private static readonly RESET_PASSWORD_EMAIL_AUTH_CODE_EXPIRATION = 30;
  private static readonly RESET_PASSWORD_TOKEN_EXPIRATION = 10;

  @Generated('increment')
  @PrimaryColumn({ type: 'bigint', unsigned: true, transformer: new BigintTransformer() })
  public readonly id: number;

  @ManyToOne(() => Member, { eager: true, createForeignKeyConstraints: false })
  @JoinColumn({ name: 'member_id' })
  public readonly member: Member;

  @Column({ type: 'varchar', length: 30, transformer: new AuthCodeTypeTransformer() })
  public readonly type: AuthCodeType;

  @Column({ type: 'varchar', length: 50 })
  public readonly code: string;

  @Column({ type: 'timestamp', transformer: new LocalDateTimeTransformer() })
  public readonly expiresAt: LocalDateTime;

  @Column({ type: 'tinyint', default: false, transformer: new BooleanTransformer() })
  public isVerified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: new LocalDateTimeTransformer() })
  public createdAt: LocalDateTime;

  @BeforeInsert()
  protected beforeInsert() {
    this.createdAt = LocalDateTime.now();
  }

  private constructor(member: Member, type: AuthCodeType, code: string, expiresAt: LocalDateTime) {
    super();
    this.member = member;
    this.type = type;
    this.code = code;
    this.expiresAt = expiresAt;
  }

  public static createResetPasswordEmailAuthCode(member: Member): AuthCode {
    const authCode = StringUtil.fromNumber(RandomUtil.generateRandomSixDigits());

    if (!authCode) {
      throw new InternalServerException(InternalServerException.ErrorCodes.FAILED_TO_GENERATE_AUTH_CODE);
    }

    return new AuthCode(
      member,
      AuthCodeType.RESET_PASSWORD_EMAIL_AUTH_CODE,
      authCode as string,
      LocalDateTime.now().plusMinutes(this.RESET_PASSWORD_EMAIL_AUTH_CODE_EXPIRATION),
    );
  }

  public static createResetPasswordToken(member: Member): AuthCode {
    return new AuthCode(
      member,
      AuthCodeType.RESET_PASSWORD_TOKEN,
      RandomUtil.generateUuidV4(),
      LocalDateTime.now().plusMinutes(this.RESET_PASSWORD_TOKEN_EXPIRATION),
    );
  }

  public verify(email: string): void {
    if (this.isVerified) {
      throw new BadRequestException(BadRequestException.ErrorCodes.FAILED_TO_VERIFY_AUTH_CODE);
    }

    if (!this.isEqualToEmail(email)) {
      throw new BadRequestException(BadRequestException.ErrorCodes.FAILED_TO_VERIFY_AUTH_CODE);
    }

    if (LocalDateTime.now().isAfter(this.expiresAt)) {
      throw new BadRequestException(BadRequestException.ErrorCodes.FAILED_TO_VERIFY_AUTH_CODE);
    }

    this.isVerified = true;
  }

  private isEqualToEmail(email: string): boolean {
    return this.member.isEqualToEmail(email);
  }
}
