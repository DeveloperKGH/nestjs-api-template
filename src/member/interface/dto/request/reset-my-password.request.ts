import { IsPassword } from '../../../../global/decorator/validator.decorator';
import { ResetMyPasswordServiceDto } from '../../../application/dto/reset-my-password.service.dto';

export class ResetMyPasswordRequest {
  @IsPassword()
  public password!: string;

  @IsPassword()
  public newPassword!: string;

  public toServiceDto(): ResetMyPasswordServiceDto {
    return ResetMyPasswordServiceDto.of(this.password, this.newPassword);
  }
}
