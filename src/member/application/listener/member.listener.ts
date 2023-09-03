import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthService } from '../../../auth/application/service/auth.service';
import { JwtTokenService } from '../../../auth/application/service/jwt-token.service';
import { WithdrawnMember } from '../../domain/entity/withdrawn-member.entity';

@Injectable()
export class MemberListener {
  public static readonly WITHDRAW_MEMBER_EVENT = 'member.withdraw';

  constructor(
    private readonly authService: AuthService,

    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @OnEvent(MemberListener.WITHDRAW_MEMBER_EVENT, { async: true })
  async deleteAuthCode(member: WithdrawnMember) {
    await this.authService.removeAuthCodes(member.memberId);
  }

  @OnEvent(MemberListener.WITHDRAW_MEMBER_EVENT, { async: true })
  async deleteRefreshToken(member: WithdrawnMember) {
    await this.jwtTokenService.removeRefreshToken(member.memberId);
  }
}
