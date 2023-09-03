import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '../../global/exception/unauthorized.exception';
import { NAMESPACE_MEMBER } from '../../global/common/constant/namespace.code';
import { MemberContextDto } from '../../global/context/member-context.dto';
import { GlobalContextUtil } from '../../global/util/global-context.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  override canActivate(context: ExecutionContext): boolean {
    return super.canActivate(context) as boolean;
  }

  override handleRequest(err: any, user: any, info: { message: string }) {
    const message = info?.message;

    if (message === 'No auth token') {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.NO_AUTH_TOKEN);
    }

    if (message === 'jwt malformed') {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.INVALID_TOKEN);
    }

    if (message === 'jwt expired') {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.INVALID_TOKEN);
    }

    if (message === 'invalid signature') {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.INVALID_TOKEN);
    }

    if (message) {
      throw new UnauthorizedException(UnauthorizedException.ErrorCodes.INVALID_TOKEN);
    }

    if (err) {
      throw err;
    }

    const namespace = GlobalContextUtil.getMainNamespace();

    namespace.set(NAMESPACE_MEMBER, MemberContextDto.of(user.memberId, user.email));

    return user;
  }
}
