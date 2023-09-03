import { AuthCode } from '../entity/auth-code.entity';
import { AuthCodeType } from '../enum/auth-code-type.enum';

export interface AuthCodeCommandRepository {
  save(authCode: AuthCode): Promise<AuthCode>;

  findAllByMemberIdAndTypeAndCreatedAtToday(memberId: number, type: AuthCodeType): Promise<AuthCode[]>;

  findByCode(code: string): Promise<AuthCode | null>;

  findAllByMemberId(memberId: number): Promise<AuthCode[]>;

  remove(authCode: AuthCode): Promise<void>;

  removeAll(authCode: AuthCode[]): Promise<void>;
}

export const AuthCodeCommandRepository = Symbol('AuthCodeCommandRepository');
