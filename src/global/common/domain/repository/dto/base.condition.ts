import { SortOptionCondition } from './sort-option.condition';
import { SortEnum } from '../../enum/sort.enum';

export abstract class BaseCondition {
  page?: number | null | undefined;

  size?: number | null | undefined;

  lastId?: number | null | undefined;

  _sort?: SortOptionCondition[] | null | undefined;

  protected constructor(
    page?: number | null | undefined,
    size?: number | null | undefined,
    lastId?: number | null | undefined,
    sort?: SortOptionCondition[] | null | undefined,
  ) {
    this.page = page;
    this.size = size;
    this.lastId = lastId;
    this._sort = sort;
  }

  getOffset(): number | undefined {
    if (this.page === null || this.page === undefined || this.size === null || this.size === undefined) {
      return;
    }

    return (this.page - 1) * this.size;
  }

  getLimit(): number | undefined {
    if (this.size === null || this.size === undefined) {
      return;
    }

    return this.size;
  }

  getLastId(): number | undefined {
    if (this.lastId === null || this.lastId === undefined) {
      return;
    }

    return this.lastId;
  }

  get sort(): SortOptionCondition[] {
    if (!this._sort || this._sort.length < 1) {
      return [new SortOptionCondition('id', SortEnum.DESC)];
    }

    return this._sort;
  }
}
