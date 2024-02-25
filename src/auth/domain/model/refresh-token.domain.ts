import { LocalDateTime } from '@js-joda/core';
import { Member } from '../../../member/domain/model/member.domain';
import { RandomUtil } from '../../../global/util/random.util';
import { InternalServerException } from '../../../global/exception/internal-server.exception';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadServiceDto } from '../../application/dto/token-payload.service.dto';
import { NumberUtil } from '../../../global/util/number.util';
import { RefreshTokenEncrypterService } from '../service/refresh-token-encrypter.service';

export class RefreshToken {
  private readonly _id: number | undefined;

  private readonly _member: Member | null;

  private _token: string;

  private readonly _expiresAt: LocalDateTime;

  private constructor(member: Member | null, token: string, expiresAt: LocalDateTime, id?: number | undefined) {
    this._member = member;
    this._token = token;
    this._expiresAt = expiresAt;
    this._id = id;
  }

  public static of(
    member: Member | null,
    token: string,
    expiresAt: LocalDateTime,
    id?: number | undefined,
  ): RefreshToken {
    return new RefreshToken(member, token, expiresAt, id);
  }

  public static create(member: Member, jwtService: JwtService): RefreshToken {
    const expiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRE;

    if (!expiresIn) {
      throw new InternalServerException(InternalServerException.ErrorCodes.FAILED_TO_GET_SYSTEM_VARIABLE);
    }

    const token = jwtService.sign(new TokenPayloadServiceDto(RandomUtil.generateUuidV4(), member.id!).toPlain(), {
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

    this._token = hashedToken;
  }

  get id(): number | undefined {
    return this._id;
  }

  get member(): Member | null {
    return this._member;
  }

  get token(): string {
    return this._token;
  }

  get expiresAt(): LocalDateTime {
    return this._expiresAt;
  }
}
