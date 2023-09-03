import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ValidationMessage } from '../../../../global/common/constant/validation.message';
import { IsPassword } from '../../../../global/common/decorator/validator.decorator';
import { ResetPasswordServiceDto } from '../../../application/dto/reset-password.service.dto';

export class ResetPasswordRequest {
  @IsNotEmpty({ message: ValidationMessage.email.isEmpty })
  @IsEmail({}, { message: ValidationMessage.email.isEmail })
  public email!: string;

  @IsNotEmpty()
  @IsString()
  public token!: string;

  @IsPassword()
  public password!: string;

  public toServiceDto(): ResetPasswordServiceDto {
    return ResetPasswordServiceDto.of(this.email, this.token, this.password);
  }
}
