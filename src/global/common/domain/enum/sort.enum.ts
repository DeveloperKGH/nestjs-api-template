import { Enum, EnumType } from 'ts-jenum';
import { BaseEnum } from './base.enum';
import { InternalServerException } from '../../../exception/internal-server.exception';

@Enum('code')
export class SortEnum extends EnumType<SortEnum>() implements BaseEnum {
  static readonly ASC = new SortEnum('ASC', '오름차순');
  static readonly DESC = new SortEnum('DESC', '내림차순');

  private constructor(
    readonly _code: string,
    readonly _name: string,
  ) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  public static findCode(value: string): SortEnum {
    const code = this.values().find(sort => sort.code === value);

    if (!code) {
      throw new InternalServerException(InternalServerException.ErrorCodes.NOT_SUPPORTED_CODE, value);
    }

    return code;
  }
}
