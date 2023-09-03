import { SortEnum } from '../../enum/sort.enum';

export class SortOptionCondition {
  field!: string;

  orderBy!: SortEnum;

  constructor(field: string, orderBy: SortEnum) {
    this.field = field;
    this.orderBy = orderBy;
  }
}
