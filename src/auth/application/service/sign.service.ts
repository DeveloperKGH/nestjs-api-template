import { Inject, Injectable } from '@nestjs/common';
import { SignUpServiceDto } from '../dto/sign-up.service.dto';
import { Member } from '../../../member/infra/typeorm/entity/member.entity';
import { MemberCommandRepository } from '../../../member/domain/repository/member-command.repository';
import { ConflictException } from '../../../global/exception/conflict.exception';
import { SignInServiceDto } from '../dto/sign-in.service.dto';
import { TokenServiceDto } from '../dto/token.service.dto';
import { JwtTokenService } from './jwt-token.service';
import { UnauthorizedException } from '../../../global/exception/unauthorized.exception';
import { PasswordEncrypterServiceToken } from '../../domain/service/password-encrypter.service';
import { Transactional } from '../../../global/infra/typeorm/transactional.decorator';
import { RefreshTokenEncrypterService } from '../../domain/service/refresh-token-encrypter.service';

@Injectable()
export class SignService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,

    @Inject(MemberCommandRepository)
    private readonly memberCommandRepository: MemberCommandRepository,

    @Inject(PasswordEncrypterServiceToken)
    private readonly passwordEncrypter: RefreshTokenEncrypterService,
  ) {}

  @Transactional()
  async signUp(dto: SignUpServiceDto): Promise<Member> {
    const member = await Member.signUpMember(dto.email, dto.password, this.passwordEncrypter);

    if (await this.memberCommandRepository.existByEmail(member.email)) {
      throw new ConflictException(ConflictException.ErrorCodes.DUPLICATE_EMAIL);
    }

    await this.memberCommandRepository.save(member);

    return member;
  }

  async signIn(dto: SignInServiceDto): Promise<TokenServiceDto> {
    const foundMember = await this.memberCommandRepository.findByEmail(dto.email);

    if (!foundMember) {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.INVALID_CREDENTIALS);
    }

    if (!(await foundMember.isMatchPassword(dto.password, this.passwordEncrypter))) {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.INVALID_CREDENTIALS);
    }

    await this.jwtTokenService.createAccessToken(foundMember);

    return TokenServiceDto.of(
      await this.jwtTokenService.createAccessToken(foundMember),
      await this.jwtTokenService.createRefreshToken(foundMember),
    );
  }
}
