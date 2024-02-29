import { IsOptional, IsString } from 'class-validator';
import { UpdateMyInfoServiceDto } from '../../../application/dto/update-my-info.service.dto';

export class UpdateMyInfoRequest {
  @IsString()
  @IsOptional()
  name?: string | undefined;

  public toServiceDto(): UpdateMyInfoServiceDto {
    return UpdateMyInfoServiceDto.of(this.name);
  }
}
