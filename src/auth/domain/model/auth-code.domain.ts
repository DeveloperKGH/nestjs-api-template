import { AuthCodeType } from '../enum/auth-code-type.enum';
import { LocalDateTime } from '@js-joda/core';
import { Member } from '../../../member/domain/model/member.domain';
import { StringUtil } from '../../../global/util/string.util';
import { RandomUtil } from '../../../global/util/random.util';
import { InternalServerException } from '../../../global/exception/internal-server.exception';
import { BadRequestException } from '../../../global/exception/bad-request.exception';
import { isEmpty } from '../../../global/util/common.util';

export class AuthCode {
  private static readonly RESET_PASSWORD_EMAIL_AUTH_CODE_EXPIRATION = 30;
  private static readonly RESET_PASSWORD_TOKEN_EXPIRATION = 10;

  private readonly _id: number | undefined;

  private readonly _member: Member | null;

  private readonly _type: AuthCodeType;

  private readonly _code: string;

  private readonly _expiresAt: LocalDateTime;

  public _isVerified: boolean;

  private constructor(
    member: Member | null,
    type: AuthCodeType,
    code: string,
    expiresAt: LocalDateTime,
    isVerified: boolean,
    id?: number | undefined,
  ) {
    this._member = member;
    this._type = type;
    this._code = code;
    this._expiresAt = expiresAt;
    this._isVerified = isVerified;
    this._id = id;
  }

  public static of(
    member: Member | null,
    type: AuthCodeType,
    code: string,
    expiresAt: LocalDateTime,
    isVerified: boolean,
    id?: number | undefined,
  ): AuthCode {
    return new AuthCode(member, type, code, expiresAt, isVerified, id);
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
      false,
    );
  }

  public static createResetPasswordToken(member: Member): AuthCode {
    return new AuthCode(
      member,
      AuthCodeType.RESET_PASSWORD_TOKEN,
      RandomUtil.generateUuidV4(),
      LocalDateTime.now().plusMinutes(this.RESET_PASSWORD_TOKEN_EXPIRATION),
      false,
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

    this._isVerified = true;
  }

  private isEqualToEmail(email: string): boolean {
    if (isEmpty(this.member)) {
      return false;
    }

    return this.member!.isEqualToEmail(email);
  }

  get id(): number | undefined {
    return this._id;
  }

  get member(): Member | null {
    return this._member;
  }

  get type(): AuthCodeType {
    return this._type;
  }

  get code(): string {
    return this._code;
  }

  get expiresAt(): LocalDateTime {
    return this._expiresAt;
  }

  get isVerified(): boolean {
    return this._isVerified;
  }
}
