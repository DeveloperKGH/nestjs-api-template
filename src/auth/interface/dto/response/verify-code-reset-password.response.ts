import { Exclude, Expose } from 'class-transformer';
import { AuthCode } from '../../../domain/model/auth-code.domain';

export class VerifyCodeResetPasswordResponse {
  @Exclude() private readonly _token: string;

  constructor(token: string) {
    this._token = token;
  }

  @Expose()
  get token(): string {
    return this._token;
  }

  public static fromDomain(domain: AuthCode): VerifyCodeResetPasswordResponse {
    return new VerifyCodeResetPasswordResponse(domain.code);
  }
}
