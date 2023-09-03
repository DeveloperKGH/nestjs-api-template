export interface RefreshTokenEncrypter {
  hash(token: string): Promise<string | null>;

  match(token: string, hashedToken: string | null): Promise<boolean>;
}

export const RefreshTokenEncrypter = Symbol('RefreshTokenEncrypter');
