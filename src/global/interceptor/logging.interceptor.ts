import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { GlobalContextUtil } from '../util/global-context.util';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestContextDto } from '../context/request-context.dto';
import { LoggerService, LoggerServiceToken } from '../logger/logger.service';
import { LoggerServiceDto } from '../logger/logger.service.dto';
import { getIp } from '../function/common.function';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(LoggerServiceToken) private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let requestContext = GlobalContextUtil.getRequestContext();

    if (!requestContext) {
      requestContext = RequestContextDto.createDefault(
        getIp(request),
        request.get('user-agent'),
        request.method,
        request.originalUrl,
        request.body,
        request.query,
      );
    }

    return next.handle().pipe(
      map(data => {
        return data;
      }),

      tap(() => {
        this.loggerService.info(
          LoggerServiceDto.createLog(response.statusCode, requestContext, GlobalContextUtil.getMember()),
        );
      }),
    );
  }
}
