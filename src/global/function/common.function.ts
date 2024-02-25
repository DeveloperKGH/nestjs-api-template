import { HttpStatus, INestApplication, INestMicroservice } from '@nestjs/common';
import { LoggerService, LoggerServiceToken } from '../logger/logger.service';
import { ErrorLoggerField, LoggerServiceDto } from '../logger/logger.service.dto';
import { Request } from 'express';
import { isNotEmpty } from '../util/common.util';

export function handleFatalErrors<T extends INestMicroservice | INestApplication>(app: T) {
  const loggerService = app.get<LoggerService>(LoggerServiceToken);

  process.on('unhandledRejection', async error => {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error instanceof Error ? error.message : 'Unhandled Rejection';
    const stacktrace = error instanceof Error ? error.stack : '';

    await loggerService.error(
      LoggerServiceDto.createErrorLog(
        status,
        undefined,
        undefined,
        ErrorLoggerField.of(status, message, {}, stacktrace),
      ),
    );

    process.exit(1);
  });

  process.on('uncaughtException', async error => {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error instanceof Error ? error.message : 'Uncaught Exception';
    const stacktrace = error instanceof Error ? error.stack : '';

    await loggerService.error(
      LoggerServiceDto.createErrorLog(
        status,
        undefined,
        undefined,
        ErrorLoggerField.of(status, message, {}, stacktrace),
      ),
    );

    process.exit(1);
  });
}

export function getIp(request: Request): string {
  // X-Forwarded-For 헤더에서 IP 주소 추출
  let ip = request.headers['x-forwarded-for']?.toString().split(',')[0] ?? '';

  // IP 주소가 IPv6 형식인 경우, 앞부분 제거
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }

  return isNotEmpty(ip) ? ip : request.ip;
}
