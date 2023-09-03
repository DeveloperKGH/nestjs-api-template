import { IsNotEmpty, IsString } from 'class-validator';
import { RefreshTokenServiceDto } from '../../../application/dto/refresh-token.service.dto';

export class RefreshTokenRequest {
  @IsString()
  @IsNotEmpty()
  public refreshToken!: string;

  public toServiceDto(): RefreshTokenServiceDto {
    return RefreshTokenServiceDto.of(this.refreshToken);
  }
}
