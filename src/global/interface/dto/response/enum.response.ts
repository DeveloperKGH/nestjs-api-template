import { Expose } from 'class-transformer';
import { BaseEnum } from '../../../domain/enum/base.enum';

export class EnumResponse<T extends BaseEnum> {
  @Expose()
  protected readonly code: string;

  @Expose()
  protected readonly name: string;

  constructor(enumValue: T) {
    this.code = enumValue.code;
    this.name = enumValue.name;
  }

  public static of(enumValue: any): EnumResponse<any> {
    return new EnumResponse(enumValue);
  }
}
