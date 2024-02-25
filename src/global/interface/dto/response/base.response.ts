import { LocalDateTime } from '@js-joda/core';
import { FromLocalDateTime } from '../../../decorator/transformer.decorator';

export class BaseResponse<T> {
  public static readonly SUCCESS_CODE = 200;

  code: number;

  message: string;

  data: T;

  @FromLocalDateTime()
  timestamp: LocalDateTime;

  public static successResponse<U>(data: U): BaseResponse<U> {
    const response = new BaseResponse<U>();
    response.code = BaseResponse.SUCCESS_CODE;
    response.message = 'OK';
    response.data = data;
    response.timestamp = LocalDateTime.now();

    return response;
  }

  public static errorResponse<U>(code: number, message: string, data: U): BaseResponse<U> {
    const response = new BaseResponse<U>();
    response.code = code;
    response.message = message;
    response.data = data;
    response.timestamp = LocalDateTime.now();

    return response;
  }

  public static voidResponse(): BaseResponse<Void> {
    const response = new BaseResponse<Void>();
    response.code = BaseResponse.SUCCESS_CODE;
    response.message = 'OK';
    response.data = {};
    response.timestamp = LocalDateTime.now();

    return response;
  }
}
