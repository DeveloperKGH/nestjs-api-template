import { SortEnum } from '../../../domain/enum/sort.enum';
import { SortOptionCondition } from '../../../domain/repository/dto/sort-option.condition';

export class SortOptionRequest {
  field!: string;

  orderBy!: SortEnum;

  private constructor(field: string, orderBy: SortEnum) {
    this.field = field;
    this.orderBy = orderBy;
  }

  public static of(field: string, orderBy: string): SortOptionRequest {
    return new SortOptionRequest(field, SortEnum.findCode(orderBy));
  }

  public toCondition(): SortOptionCondition {
    return new SortOptionCondition(this.field, this.orderBy);
  }
}
