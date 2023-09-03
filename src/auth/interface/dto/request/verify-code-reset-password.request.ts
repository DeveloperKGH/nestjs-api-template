import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { VerifyCodeResetPasswordServiceDto } from '../../../application/dto/verify-code-reset-password.service.dto';
import { ValidationMessage } from '../../../../global/common/constant/validation.message';

export class VerifyCodeResetPasswordRequest {
  @IsNotEmpty({ message: ValidationMessage.email.isEmpty })
  @IsEmail({}, { message: ValidationMessage.email.isEmail })
  public email!: string;

  @Length(6, 6)
  @IsString()
  @IsNotEmpty()
  public code!: string;

  public toServiceDto(): VerifyCodeResetPasswordServiceDto {
    return VerifyCodeResetPasswordServiceDto.of(this.email, this.code);
  }
}
