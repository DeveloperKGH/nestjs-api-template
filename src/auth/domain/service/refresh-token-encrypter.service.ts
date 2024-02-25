export interface RefreshTokenEncrypterService {
  hash(token: string): Promise<string | null>;

  match(token: string, hashedToken: string | null): Promise<boolean>;
}

export const RefreshTokenEncrypterServiceToken = Symbol('RefreshTokenEncrypterService');
