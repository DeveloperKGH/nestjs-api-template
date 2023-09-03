import { Inject, Injectable } from '@nestjs/common';
import { SendCodeResetPasswordServiceDto } from '../dto/send-code-reset-password.service.dto';
import { NotFoundException } from '../../../global/exception/not-found.exception';
import { EmailService } from '../../../global/common/infra/email/email.service';
import { AuthCodeCommandRepository } from '../../domain/repository/auth-code-command.repository';
import { AuthCode } from '../../domain/entity/auth-code.entity';
import { MemberCommandRepository } from '../../../member/domain/repository/member-command.repository';
import { VerifyCodeResetPasswordServiceDto } from '../dto/verify-code-reset-password.service.dto';
import { BadRequestException } from '../../../global/exception/bad-request.exception';
import { AuthCodeType } from '../../domain/enum/auth-code-type.enum';
import { TooManyRequestsException } from '../../../global/exception/too-many-requests.exception';
import { Member } from '../../../member/domain/entity/member.entity';
import { Propagation, Transactional } from '../../../global/common/decorator/transactional.decorator';
import { ResetPasswordServiceDto } from '../dto/reset-password.service.dto';
import { PasswordEncrypter } from '../../domain/password-encrypter.service';
import { RefreshTokenServiceDto } from '../dto/refresh-token.service.dto';
import { TokenServiceDto } from '../dto/token.service.dto';
import { JwtTokenService } from './jwt-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtTokenService: JwtTokenService,

    @Inject(MemberCommandRepository)
    private readonly memberCommandRepository: MemberCommandRepository,

    @Inject(AuthCodeCommandRepository)
    private readonly authCodeCommandRepository: AuthCodeCommandRepository,

    @Inject(EmailService)
    private readonly emailService: EmailService,

    @Inject(PasswordEncrypter)
    private readonly passwordEncrypter: PasswordEncrypter,
  ) {}

  @Transactional()
  async sendCodeToResetPassword(dto: SendCodeResetPasswordServiceDto): Promise<void> {
    const foundMember: Member | null = await this.memberCommandRepository.findByEmail(dto.email);

    if (!foundMember) {
      throw new NotFoundException(NotFoundException.ErrorCodes.NOT_FOUND_MEMBER);
    }

    const foundAuthCode = await this.authCodeCommandRepository.findAllByMemberIdAndTypeAndCreatedAtToday(
      foundMember.id,
      AuthCodeType.RESET_PASSWORD_EMAIL_AUTH_CODE,
    );

    if (foundAuthCode.length === 10) {
      throw new TooManyRequestsException(
        TooManyRequestsException.ErrorCodes.RESET_PASSWORD_EMAIL_REQUEST_LIMIT_EXCEEDED,
      );
    }

    const authCode = AuthCode.createResetPasswordEmailAuthCode(foundMember);

    await this.authCodeCommandRepository.save(authCode);

    this.emailService.send(foundMember.email, '인증번호', authCode.code);
  }

  @Transactional()
  async verifyAuthCodeByResetPassword(dto: VerifyCodeResetPasswordServiceDto): Promise<AuthCode> {
    const foundAuthCode: AuthCode | null = await this.authCodeCommandRepository.findByCode(dto.code);

    if (!foundAuthCode) {
      throw new BadRequestException(BadRequestException.ErrorCodes.FAILED_TO_VERIFY_AUTH_CODE);
    }

    foundAuthCode.verify(dto.email);

    await this.authCodeCommandRepository.save(foundAuthCode);

    const token = AuthCode.createResetPasswordToken(foundAuthCode.member);

    return await this.authCodeCommandRepository.save(token);
  }

  @Transactional()
  async resetPassword(dto: ResetPasswordServiceDto): Promise<void> {
    const foundToken: AuthCode | null = await this.authCodeCommandRepository.findByCode(dto.token);

    if (!foundToken) {
      throw new BadRequestException(BadRequestException.ErrorCodes.FAILED_TO_VERIFY_AUTH_CODE);
    }

    foundToken.verify(dto.email);

    await this.authCodeCommandRepository.save(foundToken);

    await foundToken.member.resetPassword(dto.password, this.passwordEncrypter);

    await this.memberCommandRepository.save(foundToken.member);
  }

  @Transactional()
  async refreshAccessToken(dto: RefreshTokenServiceDto): Promise<TokenServiceDto> {
    const member = await this.jwtTokenService.verifyRefreshToken(dto.refreshToken);

    return TokenServiceDto.of(
      await this.jwtTokenService.createAccessToken(member),
      await this.jwtTokenService.createRefreshToken(member),
    );
  }

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  async removeAuthCodes(memberId: number): Promise<void> {
    const foundAuthCodes = await this.authCodeCommandRepository.findAllByMemberId(memberId);

    await this.authCodeCommandRepository.removeAll(foundAuthCodes);
  }
}
