import { BaseException } from './base.exception';
import { ErrorCode } from './ErrorCode';
import { HttpStatus } from '@nestjs/common';

export class NotFoundException extends BaseException {
  static readonly ErrorCodes = {
    NOT_FOUND_MEMBER: ErrorCode.create(404001, '가입된 회원이 아닙니다.'),
    NOT_FOUND_REFRESH_TOKEN: ErrorCode.create(404002, 'Refresh Token 을 찾을 수 아닙니다.'),
  };

  constructor(errorCode: ErrorCode, data?: any) {
    super(HttpStatus.NOT_FOUND, errorCode.code, errorCode.message, data);
  }
}
