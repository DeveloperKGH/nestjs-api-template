import { RefreshToken } from '../entity/refresh-token.entity';

export interface RefreshTokenCommandRepository {
  save(authCode: RefreshToken): Promise<RefreshToken>;

  findByMemberId(memberId: number): Promise<RefreshToken | null>;

  remove(refreshToken: RefreshToken): Promise<void>;
}

export const RefreshTokenCommandRepository = Symbol('RefreshTokenCommandRepository');
