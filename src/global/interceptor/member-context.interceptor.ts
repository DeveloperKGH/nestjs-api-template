import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { isNotEmpty } from 'class-validator';
import { MemberContextDto } from '../context/member-context.dto';
import { GlobalContextUtil } from '../util/global-context.util';

@Injectable()
export class MemberContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const jwt = request.headers.authorization;

    if (isNotEmpty(user) || isNotEmpty(jwt)) {
      const memberContext = MemberContextDto.of(user?.memberId, user?.email, jwt);

      GlobalContextUtil.setMember(memberContext);

      request.memberContext = memberContext;
    }

    return next.handle();
  }
}
