import { IsNumber, IsOptional, Min } from 'class-validator';
import { Sort, ToNumber } from '../../../decorator/transformer.decorator';
import { ValidationMessage } from '../../../constant/validation.message';
import { SortOptionRequest } from './sort-option.request';

export abstract class BaseRequest {
  @IsOptional()
  @ToNumber()
  @IsNumber()
  @Min(1, { message: ValidationMessage.page.min })
  page?: number = 1;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @Min(1, { message: ValidationMessage.size.min })
  size?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  lastId?: number;

  @IsOptional()
  @Sort()
  sort?: SortOptionRequest[];
}
