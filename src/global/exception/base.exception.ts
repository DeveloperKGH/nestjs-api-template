import { HttpException } from '@nestjs/common';

export abstract class BaseException extends HttpException {
  protected constructor(httpStatus: number, code: number, message: string, data: any = {}) {
    super({ code: code, message: message, data: data }, httpStatus);
  }
}
