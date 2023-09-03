import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { BaseResponse } from '../common/interface/dto/response/base.response';
import { instanceToPlain } from 'class-transformer';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const baseResponse = BaseResponse.errorBaseResponse(
      exception['response']?.code ?? status,
      exception['response']?.message ?? exception.message,
      exception['response']?.data ?? {},
    );

    response.status(status).json(instanceToPlain(baseResponse));
  }
}
