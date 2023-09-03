import { StringUtil } from '../../../src/global/util/string.util';

describe('StringUtil', () => {
  describe('isEmpty()', () => {
    describe('입력된 문자열이 유효하지 않은경우 true 가 반환되는지 확인', () => {
      test.each([[null], [undefined], [''], ['   ']])('value : "%s"', value => {
        expect(StringUtil.isEmpty(value)).toBeTruthy();
      });
    });
    it('입력된 문자열이 유효한 경우 false 가 반환되는지 확인', () => {
      expect(StringUtil.isEmpty('abc')).toBeFalsy();
    });
  });

  describe('reverse()', () => {
    describe('입력된 문자열이 유효하지 않은경우 null 이 반환되는지 확인', () => {
      test.each([[null], [undefined], [''], ['   ']])('value : "%s"', value => {
        expect(StringUtil.reverse(value)).toBeNull();
      });
    });

    it('문자열이 역순으로 뒤집혀서 반환하는지 확인', () => {
      expect(StringUtil.reverse('abcde')).toBe('edcba');
    });
  });
});
