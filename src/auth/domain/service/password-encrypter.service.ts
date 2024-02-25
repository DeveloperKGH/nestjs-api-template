export interface PasswordEncrypterService {
  hash(password: string): Promise<string | null>;

  match(password: string, hashedPassword: string | null): Promise<boolean>;
}

export const PasswordEncrypterServiceToken = Symbol('PasswordEncrypterService');
