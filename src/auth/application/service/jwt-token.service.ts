import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadServiceDto } from '../dto/token-payload.service.dto';
import { NotFoundException } from '../../../global/exception/not-found.exception';
import { RandomUtil } from '../../../global/util/random.util';
import { RefreshTokenCommandRepository } from '../../domain/repository/refresh-token-command.repository';
import {
  RefreshTokenEncrypterService,
  RefreshTokenEncrypterServiceToken,
} from '../../domain/service/refresh-token-encrypter.service';
import { UnauthorizedException } from '../../../global/exception/unauthorized.exception';
import { Propagation, Transactional } from '../../../global/infra/typeorm/transactional.decorator';
import { Member } from '../../../member/domain/model/member.domain';
import { RefreshToken } from '../../domain/model/refresh-token.domain';
import { isEmpty } from '../../../global/util/common.util';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(RefreshTokenCommandRepository)
    private readonly refreshTokenCommandRepository: RefreshTokenCommandRepository,

    @Inject(RefreshTokenEncrypterServiceToken)
    private readonly refreshTokenEncrypter: RefreshTokenEncrypterService,
  ) {}

  async createAccessToken(member: Member): Promise<string> {
    if (!member.id) {
      throw new NotFoundException(NotFoundException.ErrorCodes.NOT_FOUND_MEMBER);
    }

    return this.jwtService.sign(
      new TokenPayloadServiceDto(RandomUtil.generateUuidV4(), member.id, member.email, member.role).toPlain(),
    );
  }

  async createRefreshToken(member: Member): Promise<string> {
    if (!member.id) {
      throw new NotFoundException(NotFoundException.ErrorCodes.NOT_FOUND_MEMBER);
    }

    const foundRefreshToken = await this.refreshTokenCommandRepository.findByMemberId(member.id);

    if (foundRefreshToken) {
      await this.refreshTokenCommandRepository.remove(foundRefreshToken);
    }

    const refreshToken = RefreshToken.create(member, this.jwtService);

    const token = refreshToken.token;

    await refreshToken.hashRefreshToken(this.refreshTokenEncrypter);

    await this.refreshTokenCommandRepository.save(refreshToken);

    return token;
  }

  public async verifyRefreshToken(token: string): Promise<Member> {
    let decodedRefreshToken = null;

    try {
      decodedRefreshToken = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY });
    } catch (e) {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.INVALID_TOKEN);
    }

    const memberId = decodedRefreshToken.memberId;

    const foundRefreshToken = await this.refreshTokenCommandRepository.findByMemberId(memberId);

    if (isEmpty(foundRefreshToken)) {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.INVALID_TOKEN);
    }

    if (isEmpty(foundRefreshToken!.member)) {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.INVALID_TOKEN);
    }

    const isMatched = await this.refreshTokenEncrypter.match(token, foundRefreshToken!.token);

    if (!isMatched) {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.INVALID_TOKEN);
    }

    await this.refreshTokenCommandRepository.remove(foundRefreshToken!);

    return foundRefreshToken!.member!;
  }

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  async removeRefreshToken(memberId: number): Promise<void> {
    const foundToken = await this.refreshTokenCommandRepository.findByMemberId(memberId);

    if (!foundToken) {
      throw new NotFoundException(NotFoundException.ErrorCodes.NOT_FOUND_REFRESH_TOKEN);
    }

    await this.refreshTokenCommandRepository.remove(foundToken);
  }
}
