import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestContextDto } from '../context/request-context.dto';
import { GlobalContextUtil } from '../util/global-context.util';
import { getIp } from '../function/common.function';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const requestContext = RequestContextDto.of(
      getIp(request),
      request.get('user-agent'),
      request.method,
      request.originalUrl,
      request.body,
      request.query,
    );

    GlobalContextUtil.setRequestContext(requestContext);

    request.requestContext = requestContext;

    return next.handle();
  }
}
