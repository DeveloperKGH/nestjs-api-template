import { Exclude, Expose } from 'class-transformer';

export class CheckEmailDuplicationResponse {
  @Exclude() private readonly _isDuplicated: boolean;

  private constructor(isDuplicated: boolean) {
    this._isDuplicated = isDuplicated;
  }

  public static from(isDuplicated: boolean): CheckEmailDuplicationResponse {
    return new CheckEmailDuplicationResponse(isDuplicated);
  }

  @Expose()
  get isDuplicated(): boolean {
    return this._isDuplicated;
  }
}
