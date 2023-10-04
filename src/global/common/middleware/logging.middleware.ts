import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GlobalContextUtil } from '../../util/global-context.util';
import { TimeUtil } from '../../util/time.util';
import { LocalDateTime } from '@js-joda/core';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  use(_req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      try {
        if (res.statusCode >= 400) {
          return;
        }

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
    });

    next();
  }
}
