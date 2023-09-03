import { Exclude, Expose } from 'class-transformer';

export class PagingResponse<T> {
  @Exclude({ toPlainOnly: true }) private readonly _page: number | null;
  @Exclude({ toPlainOnly: true }) private readonly _size: number;
  @Exclude({ toPlainOnly: true }) private readonly _totalElements: number;
  @Exclude({ toPlainOnly: true }) private readonly _numberOfElements: number;
  @Exclude({ toPlainOnly: true }) private readonly _items: T[];

  @Expose()
  get page(): number | null {
    return this._page;
  }

  @Expose()
  get size(): number {
    return this._size;
  }

  @Expose()
  get lastId(): number | null {
    return (this._items[this._items.length - 1] as any)?.id || null;
  }

  @Expose()
  get totalElements(): number {
    return this._totalElements;
  }

  @Expose()
  get numberOfElements(): number {
    return this._numberOfElements;
  }

  @Expose()
  get totalPages(): number {
    return Math.ceil(this._totalElements / this._size);
  }

  @Expose()
  get items(): T[] {
    return this._items;
  }

  constructor(page: number | null, size: number, totalElements: number, numberOfElements: number, items: T[]) {
    this._page = page;
    this._size = size;
    this._totalElements = totalElements;
    this._numberOfElements = numberOfElements;
    this._items = items;
  }
}
