export class ErrorCode {
  private readonly _code: number;
  private readonly _message: string;

  private constructor(code: number, message: string) {
    this._code = code;
    this._message = message;
  }

  static create(code: number, message: string): ErrorCode {
    return new ErrorCode(code, message);
  }

  get code(): number {
    return this._code;
  }

  get message(): string {
    return this._message;
  }
}
