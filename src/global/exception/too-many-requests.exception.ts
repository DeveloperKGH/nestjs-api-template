import { BaseException } from './base.exception';
import { ErrorCode } from './ErrorCode';
import { HttpStatus } from '@nestjs/common';

export class TooManyRequestsException extends BaseException {
  static readonly ErrorCodes = {
    RESET_PASSWORD_EMAIL_REQUEST_LIMIT_EXCEEDED: ErrorCode.create(
      429001,
      '비밀번호 재설정을 위한 인증코드 발송 횟수가 초과했습니다.',
    ),
  };

  constructor(errorCode: ErrorCode, data?: any) {
    super(HttpStatus.TOO_MANY_REQUESTS, errorCode.code, errorCode.message, data);
  }
}
