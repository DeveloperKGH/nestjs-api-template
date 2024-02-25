import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { LoggerService } from '../logger.service';
import { LoggerServiceDto } from '../logger.service.dto';
import { isEmpty } from '../../util/common.util';
import { TimeUtil } from '../../util/time.util';
import { LocalDateTime } from '@js-joda/core';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  info(serviceDto: LoggerServiceDto): void {
    try {
      const status = serviceDto.status as number;
      const requestContext = serviceDto.requestContext;
      const memberContext = serviceDto.memberContext;

      const executionTime = isEmpty(requestContext?.startTime)
        ? undefined
        : TimeUtil.getMillisOfDuration(requestContext!.startTime, LocalDateTime.now());

      const body = {
        executionTime: `${executionTime} ms`,
        ip: requestContext?.ip,
        userAgent: requestContext?.userAgent,
        header: {},
        user: memberContext,
        requestBody: '',
        queryParams: '',
      };

      if (process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'stage') {
        body.requestBody = requestContext?.requestBody ?? '';
        body.queryParams = requestContext?.queryParams ?? '';
      }

      this.logger.info(
        `${requestContext?.transactionId} ${requestContext?.httpMethod} ${requestContext?.url} ${status} - ${JSON.stringify(
          body,
        )}`,
      );
    } catch (error) {
      const isError = error instanceof Error;
      const stack = isError ? error.stack : '';
      const message = 'An unexpected error occurred in WinstonLoggerService';

      this.logger.error(`${message} : ${stack}`);
    }
  }

  error(serviceDto: LoggerServiceDto): void {
    try {
      const status = serviceDto.status as number;
      const requestContext = serviceDto.requestContext;
      const memberContext = serviceDto.memberContext;

      const executionTime = isEmpty(requestContext?.startTime)
        ? undefined
        : TimeUtil.getMillisOfDuration(requestContext!.startTime, LocalDateTime.now());

      const body = {
        executionTime: `${executionTime} ms`,
        ip: requestContext?.ip,
        userAgent: requestContext?.userAgent,
        header: {},
        user: memberContext,
        requestBody: '',
        queryParams: '',
        error: serviceDto.error,
      };

      if (status < 500) {
        this.logger.warn(
          `${requestContext?.transactionId} ${requestContext?.httpMethod} ${requestContext?.url} ${status} - ${JSON.stringify(
            body,
          )}`,
        );
        return;
      }

      body.requestBody = requestContext?.requestBody ?? '';
      body.queryParams = requestContext?.queryParams ?? '';

      this.logger.error(
        `${requestContext?.transactionId} ${requestContext?.httpMethod} ${requestContext?.url} ${status} - ${JSON.stringify(
          body,
        )}`,
      );
    } catch (error) {
      const isError = error instanceof Error;
      const stack = isError ? error.stack : '';
      const message = 'An unexpected error occurred in WinstonLoggerService';

      this.logger.error(`${message} : ${stack}`);
    }
  }
}
