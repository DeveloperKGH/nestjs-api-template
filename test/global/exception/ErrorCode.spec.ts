import { ErrorCode } from '../../../src/global/exception/ErrorCode';

describe('ErrorCode', () => {
  describe('create()', () => {
    it('ErrorCode 객체가 잘 생성되는지 확인', () => {
      expect(ErrorCode.create(404, 'NOT_FOUND')).toBeInstanceOf(ErrorCode);
    });
  });

  describe('code()', () => {
    it('getter 를 통해 올바른 value 가 반환되는지 확인', () => {
      const code = 404;
      expect(ErrorCode.create(code, 'NOT_FOUND').code).toBe(code);
    });
  });
  describe('message()', () => {
    it('getter 를 통해 올바른 value 가 반환되는지 확인', () => {
      const message = 'NOT_FOUND';
      expect(ErrorCode.create(404, message).message).toBe(message);
    });
  });
});
