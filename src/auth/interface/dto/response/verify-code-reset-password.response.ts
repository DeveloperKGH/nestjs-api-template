import { Exclude, Expose } from 'class-transformer';
import { AuthCode } from '../../../domain/entity/auth-code.entity';

export class VerifyCodeResetPasswordResponse {
  @Exclude() private readonly _token: string;

  constructor(token: string) {
    this._token = token;
  }

  @Expose()
  get token(): string {
    return this._token;
  }

  public static fromEntity(entity: AuthCode): VerifyCodeResetPasswordResponse {
    return new VerifyCodeResetPasswordResponse(entity.code);
  }
}
