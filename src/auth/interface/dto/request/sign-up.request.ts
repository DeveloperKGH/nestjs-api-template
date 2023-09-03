import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsPassword } from '../../../../global/common/decorator/validator.decorator';
import { SignUpServiceDto } from '../../../application/dto/sign-up.service.dto';
import { ValidationMessage } from '../../../../global/common/constant/validation.message';

export class SignUpRequest {
  @IsNotEmpty({ message: ValidationMessage.email.isEmpty })
  @IsEmail({}, { message: ValidationMessage.email.isEmail })
  public email!: string;

  @IsPassword()
  public password!: string;

  public toServiceDto(): SignUpServiceDto {
    return SignUpServiceDto.of(this.email, this.password);
  }
}
