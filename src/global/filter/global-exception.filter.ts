import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { BaseResponse } from '../interface/dto/response/base.response';
import { instanceToPlain } from 'class-transformer';
import { RequestContextDto } from '../context/request-context.dto';
import { MemberContextDto } from '../context/member-context.dto';
import { LoggerService, LoggerServiceToken } from '../logger/logger.service';
import { ErrorLoggerField, LoggerServiceDto } from '../logger/logger.service.dto';
import { isEmpty } from '../util/common.util';
import { getIp } from '../function/common.function';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LoggerServiceToken) private readonly loggerService: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    try {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest();
      const response = ctx.getResponse();

      let status: number;
      let message: string;
      let data: unknown;
      let code: number;
      let stacktrace;
      const ip = getIp(request);

      if (exception instanceof HttpException) {
        const responseBody = exception.getResponse();
        status = exception.getStatus();
        message =
          typeof responseBody === 'object' && 'message' in responseBody
            ? (responseBody.message as string)
            : exception.message;
        data = typeof responseBody === 'object' && 'data' in responseBody ? responseBody.data : {};
        code = typeof responseBody === 'object' && 'code' in responseBody ? (responseBody.code as number) : status;
        stacktrace = exception.stack;

        this.logError(ip, status, code, message, stacktrace, data, request);

        const baseResponse = BaseResponse.errorResponse(code, message, data);
        response.status(status).json(instanceToPlain(baseResponse));

        return;
      }

      if (exception instanceof Error) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        code = status;
        message = exception.message || '';
        data = {};
        stacktrace = exception.stack || '';

        this.logError(ip, status, code, message, stacktrace, data, request);

        const baseResponse = BaseResponse.errorResponse(code, message, data);
        response.status(status).json(instanceToPlain(baseResponse));

        return;
      }

      status = HttpStatus.INTERNAL_SERVER_ERROR;
      code = status;
      message = typeof exception === 'string' ? exception : '';
      data = {};
      stacktrace = '';

      this.logError(ip, status, code, message, stacktrace, data, request);

      const baseResponse = BaseResponse.errorResponse(code, message, data);
      response.status(status).json(instanceToPlain(baseResponse));
    } catch (error) {
      const isError = error instanceof Error;
      const stacktrace = isError ? error.stack : '';
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = 'An unexpected error occurred in ApiGatewayGlobalExceptionFilter';

      this.loggerService.error(
        LoggerServiceDto.createErrorLog(
          status,
          undefined,
          undefined,
          ErrorLoggerField.of(status, message, {}, stacktrace),
        ),
      );

      host
        .switchToHttp()
        .getResponse()
        .status(status)
        .json(instanceToPlain(BaseResponse.errorResponse(status, message, {})));
    }
  }

  private logError(
    ip: string,
    status: number,
    code: number,
    message: string,
    stacktrace: string | undefined,
    data: unknown,
    request: {
      method: string;
      originalUrl: string;
      'user-agent': string;
      body: string;
      query: string;
      requestContext: RequestContextDto | undefined;
      memberContext: MemberContextDto | undefined;
    },
  ) {
    let { requestContext } = request;
    const { memberContext } = request;

    if (isEmpty(requestContext)) {
      requestContext = RequestContextDto.createDefault(
        ip,
        request.method,
        request.originalUrl,
        request['user-agent'],
        request.body,
        request.query,
      );
    }

    const loggerServiceDto = LoggerServiceDto.createErrorLog(
      status,
      requestContext,
      memberContext,
      ErrorLoggerField.of(code, message, data, stacktrace),
    );

    this.loggerService.error(loggerServiceDto);
  }
}
