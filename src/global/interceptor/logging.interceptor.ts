import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GlobalContextUtil } from '../util/global-context.util';
import { TimeUtil } from '../util/time.util';
import { LocalDateTime } from '@js-joda/core';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const res = httpContext.getResponse();

    return next.handle().pipe(
      map(data => {
        return data;
      }),

      tap(responseBody => {
        try {
          const headerContext = GlobalContextUtil.getHeader();
          const member = GlobalContextUtil.getMember()
            ? {
                id: GlobalContextUtil.getMember().id,
                email: GlobalContextUtil.getMember().email,
              }
            : null;

          const body = {
            transactionId: headerContext.transactionId,
            status: res.statusCode,
            url: `${headerContext.httpMethod} ${headerContext.url}`,
            requestBody: headerContext.requestBody,
            queryParams: headerContext.queryParams,
            responseBody: responseBody,
            ip: headerContext.ip,
            userAgent: headerContext.userAgent,
            member: member,
            executionTime: `${TimeUtil.getMillisOfDuration(headerContext.startTime, LocalDateTime.now())} ms`,
          };

          process.env.NODE_ENV === 'prod'
            ? this.logger.info(`${JSON.stringify(body)}`)
            : this.logger.info(`${JSON.stringify(body, null, 2)}`);
        } catch (e) {
          this.logger.error(`${e}`);
        }
      }),
    );
  }
}
