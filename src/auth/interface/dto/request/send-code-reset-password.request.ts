import { IsEmail, IsNotEmpty } from 'class-validator';
import { ValidationMessage } from '../../../../global/common/constant/validation.message';
import { SendCodeResetPasswordServiceDto } from '../../../application/dto/send-code-reset-password.service.dto';

export class SendCodeResetPasswordRequest {
  @IsNotEmpty({ message: ValidationMessage.email.isEmpty })
  @IsEmail({}, { message: ValidationMessage.email.isEmail })
  public email!: string;

  public toServiceDto(): SendCodeResetPasswordServiceDto {
    return SendCodeResetPasswordServiceDto.of(this.email);
  }
}
