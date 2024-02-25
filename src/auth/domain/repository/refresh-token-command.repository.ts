import { RefreshToken } from '../model/refresh-token.domain';

export interface RefreshTokenCommandRepository {
  save(authCode: RefreshToken): Promise<RefreshToken>;

  findByMemberId(memberId: number): Promise<RefreshToken | null>;

  remove(refreshToken: RefreshToken): Promise<void>;
}

export const RefreshTokenCommandRepository = Symbol('RefreshTokenCommandRepository');
