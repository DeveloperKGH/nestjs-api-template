import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MemberPayload } from './member.payload';
import { UnauthorizedException } from '../../global/exception/unauthorized.exception';
import { Reflector } from '@nestjs/core';
import { MemberRole } from '../../member/domain/enum/member-role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const payload = context.switchToHttp().getRequest().user;

    if (!payload) {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.INVALID_MEMBER_PAYLOAD);
    }

    const member = MemberPayload.from(context.switchToHttp().getRequest().user);
    const role: MemberRole = this.reflector.get<MemberRole>('role', context.getHandler());

    member.role.checkSufficientRole(role);

    return true;
  }
}
