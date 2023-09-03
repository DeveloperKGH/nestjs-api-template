import { BcryptUtil } from '../../../src/global/util/bcrypt.util';

describe('BcryptUtil', () => {
  describe('hash()', () => {
    it('입력된 패스워드와 해싱된 패스워드가 다른지 확인', async () => {
      const password = 'a123456!';
      expect(await BcryptUtil.hash(password)).not.toBe(password);
    });
  });

  describe('match()', () => {
    it('입력된 패스워드가 올바른 경우 true 를 반환하는지 확인', async () => {
      //given
      const password = 'a123456!';
      const hashedPassword = await BcryptUtil.hash(password);

      //when
      const result = await BcryptUtil.match(password, hashedPassword);

      //then
      expect(result).toBe(true);
    });

    it('입력된 패스워드가 틀린 경우 false 를 반환하는지 확인', async () => {
      //given
      const password = 'a123456!';
      const hashedPassword = await BcryptUtil.hash('!654321a');

      //when
      const result = await BcryptUtil.match(password, hashedPassword);

      //then
      expect(result).toBe(false);
    });
  });
});
