import { MemberRole } from '../../../../src/member/domain/enum/member-role.enum';

describe('MemberRole', () => {
  describe('ADMIN', () => {
    it('프로퍼티가 잘 반환되는지 확인', () => {
      const role = MemberRole.ADMIN;

      expect(role.code).toBe('ADMIN');
      expect(role.name).toBe('관리자');
    });
  });

  describe('MEMBER', () => {
    it('프로퍼티가 잘 반환되는지 확인', () => {
      const role = MemberRole.MEMBER;

      expect(role.code).toBe('MEMBER');
      expect(role.name).toBe('회원');
    });
  });
});
