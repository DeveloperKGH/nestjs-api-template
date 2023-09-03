import { ConflictException } from '../../../src/global/exception/conflict.exception';
import { HttpStatus } from '@nestjs/common';

describe('ConflictException', () => {
  let exception: ConflictException;

  beforeEach(() => {
    exception = new ConflictException(ConflictException.ErrorCodes.DUPLICATE_EMAIL);
  });

  it('객체가 잘 생성되는지 확인', () => {
    expect(exception).toBeInstanceOf(ConflictException);
  });

  it('Http Status 가 409 CONFLICT 인지 확인', () => {
    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
  });

  it('getResponse() 가 잘 반환되는지 확인', () => {
    const response = exception.getResponse() as { code: number; message: string; data: any };

    expect(response.code).toBe(ConflictException.ErrorCodes.DUPLICATE_EMAIL.code);
    expect(response.message).toBe(ConflictException.ErrorCodes.DUPLICATE_EMAIL.message);
    expect(response.data).toEqual({});
  });
});
