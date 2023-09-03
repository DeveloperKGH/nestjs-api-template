import { Member } from '../../../../src/member/domain/entity/member.entity';
import { StringUtil } from '../../../../src/global/util/string.util';
import { MemberRole } from '../../../../src/member/domain/enum/member-role.enum';
import { PasswordEncrypter } from '../../../../src/auth/domain/password-encrypter.service';

describe('Member', () => {
  let signUpMember: Member;
  beforeEach(async () => {
    signUpMember = await Member.signUpMember('developerkgh@gmail.com', 'a1234567!', mockPasswordEncrypter);
  });

  const mockPasswordEncrypter: PasswordEncrypter = {
    async hash(password: string): Promise<string | null> {
      return StringUtil.reverse(password);
    },
    async match(password: string, hashedPassword: string): Promise<boolean> {
      return (await this.hash(password)) === hashedPassword;
    },
  };

  describe('signUpMember()', () => {
    it('회원 객체가 정상적으로 생성되는지 확인', async () => {
      const member: Member = await Member.signUpMember('developerkgh@gmail.com', 'a1234567!', mockPasswordEncrypter);
      expect(member).toBeInstanceOf(Member);
      expect(member).toEqual(signUpMember);
    });

    it('회원의 비밀번호가 암호화가 잘되는지 확인', async () => {
      expect(signUpMember.password).toBe('!7654321a');
    });

    it('회원의 role 이 MEMBER 인지 확인', async () => {
      expect(signUpMember.role).toBe(MemberRole.MEMBER);
    });
  });
  describe('isMatchPassword()', () => {
    it('입력된 비밀번호와 암호화된 회원의 비밀번호가 일치하는 경우 true 가 반환되는지 확인', async () => {
      expect(await signUpMember.isMatchPassword('a1234567!', mockPasswordEncrypter)).toBeTruthy();
    });

    it('입력된 비밀번호와 암호화된 회원의 비밀번호가 일치하지 않는 경우 false 가 반환되는지 확인', async () => {
      expect(await signUpMember.isMatchPassword('aaaa', mockPasswordEncrypter)).toBeFalsy();
    });
  });
});
