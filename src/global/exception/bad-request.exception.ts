import { BaseException } from './base.exception';
import { ErrorCode } from './ErrorCode';
import { HttpStatus } from '@nestjs/common';

export class BadRequestException extends BaseException {
  static readonly ErrorCodes = {
    INVALID_PARAMETER: ErrorCode.create(400000, '유효하지 않은 파라미터입니다.'),
    FAILED_TO_VERIFY_AUTH_CODE: ErrorCode.create(400001, '인증번호가 맞지 않습니다.'),
    INVALID_PASSWORD: ErrorCode.create(400002, '기존 비밀번호가 맞지 않습니다.'),
    INVALID_SORT_OPTION: ErrorCode.create(400003, '유효하지 않은 Sort Option입니다.'),
  };

  constructor(errorCode: ErrorCode, data?: any) {
    super(HttpStatus.BAD_REQUEST, errorCode.code, errorCode.message, data);
  }
}
