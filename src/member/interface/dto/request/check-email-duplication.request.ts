import { IsEmail, IsNotEmpty } from 'class-validator';
import { ValidationMessage } from '../../../../global/common/constant/validation.message';
import { CheckEmailDuplicationServiceDto } from '../../../application/dto/check-email-duplication-service.dto';

export class CheckEmailDuplicationRequest {
  @IsNotEmpty({ message: ValidationMessage.email.isEmpty })
  @IsEmail({}, { message: ValidationMessage.email.isEmail })
  email: string;

  public toServiceDto(): CheckEmailDuplicationServiceDto {
    return CheckEmailDuplicationServiceDto.of(this.email);
  }
}
