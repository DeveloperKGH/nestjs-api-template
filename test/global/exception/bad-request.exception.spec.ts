import { HttpStatus } from '@nestjs/common';
import { BadRequestException } from '../../../src/global/exception/bad-request.exception';

describe('BadRequestException', () => {
  let exception: BadRequestException;

  beforeEach(() => {
    exception = new BadRequestException(BadRequestException.ErrorCodes.INVALID_PARAMETER);
  });

  it('객체가 잘 생성되는지 확인', () => {
    expect(exception).toBeInstanceOf(BadRequestException);
  });

  it('Http Status 가 400 BAD_REQUEST 인지 확인', () => {
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('getResponse() 가 잘 반환되는지 확인', () => {
    const response = exception.getResponse() as { code: number; message: string; data: any };

    expect(response.code).toBe(BadRequestException.ErrorCodes.INVALID_PARAMETER.code);
    expect(response.message).toBe(BadRequestException.ErrorCodes.INVALID_PARAMETER.message);
    expect(response.data).toEqual({});
  });
});
