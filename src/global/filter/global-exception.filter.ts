import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { BaseResponse } from '../common/interface/dto/response/base.response';
import { instanceToPlain } from 'class-transformer';
import { GlobalContextUtil } from '../util/global-context.util';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { TimeUtil } from '../util/time.util';
import { LocalDateTime } from '@js-joda/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception['response']?.message ?? exception.message;
    const stacktrace = exception.stack ?? '';
    const data = exception['response']?.data ?? {};

    const baseResponse = BaseResponse.errorBaseResponse(exception['response']?.code ?? status, message, data);

    response.status(status).json(instanceToPlain(baseResponse));

    this.logError(status, message, stacktrace);
  }

  private logError(status: number, message: string, stacktrace: string) {
    try {
      const headerContext = GlobalContextUtil.getHeader();

      const body = {
        transactionId: headerContext.transactionId,
        status: status,
        url: `${headerContext.httpMethod} ${headerContext.url}`,
        requestBody: headerContext.requestBody,
        queryParams: headerContext.queryParams,
        ip: headerContext.ip,
        userAgent: headerContext.userAgent,
        message: message,
        stacktrace: stacktrace,
        executionTime: `${TimeUtil.getMillisOfDuration(headerContext.startTime, LocalDateTime.now())} ms`,
      };

      if (status < 500) {
        process.env.NODE_ENV === 'prod'
          ? this.logger.warn(`${JSON.stringify(body)}`)
          : this.logger.warn(`${JSON.stringify(body, null, 2)}`);
        return;
      }

      process.env.NODE_ENV === 'prod'
        ? this.logger.error(`${JSON.stringify(body)}`)
        : this.logger.error(`${JSON.stringify(body, null, 2)}`);
    } catch (e) {
      this.logger.error(`${e}`);
    }
  }
}
