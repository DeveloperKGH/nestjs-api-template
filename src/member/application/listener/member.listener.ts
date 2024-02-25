import { Injectable } from '@nestjs/common';
import { AuthService } from '../../../auth/application/service/auth.service';
import { JwtTokenService } from '../../../auth/application/service/jwt-token.service';
import { OnSafeEvent } from '../../../global/decorator/on-safe-event.decorator';
import { WithdrawnMember } from '../../domain/model/withdrawn-member.domain';

@Injectable()
export class MemberListener {
  public static readonly WITHDRAW_MEMBER_EVENT = 'member.withdraw';

  constructor(
    private readonly authService: AuthService,

    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @OnSafeEvent(MemberListener.WITHDRAW_MEMBER_EVENT, { async: true })
  async deleteAuthCode(member: WithdrawnMember) {
    await this.authService.removeAuthCodes(member.memberId);
  }

  @OnSafeEvent(MemberListener.WITHDRAW_MEMBER_EVENT, { async: true })
  async deleteRefreshToken(member: WithdrawnMember) {
    await this.jwtTokenService.removeRefreshToken(member.memberId);
  }
}
