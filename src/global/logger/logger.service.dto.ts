import { RequestContextDto } from '../context/request-context.dto';
import { MemberContextDto } from '../context/member-context.dto';

export class ErrorLoggerField {
  private readonly _code?: number | undefined;
  private readonly _message?: string | undefined;
  private readonly _data?: unknown;
  private readonly _stacktrace?: string | undefined;

  private constructor(
    code?: number | undefined,
    message?: string | undefined,
    data?: unknown,
    stacktrace?: string | undefined,
  ) {
    this._code = code;
    this._message = message;
    this._data = data;
    this._stacktrace = stacktrace;
  }

  public static of(
    code?: number | undefined,
    message?: string | undefined,
    data?: unknown,
    stacktrace?: string | undefined,
  ): ErrorLoggerField {
    return new ErrorLoggerField(code, message, data, stacktrace);
  }

  get code(): number | undefined {
    return this._code;
  }

  get message(): string | undefined {
    return this._message;
  }

  get data(): unknown {
    return this._data;
  }

  get stacktrace(): string | undefined {
    return this._stacktrace;
  }
}

export class LoggerServiceDto {
  private readonly _status?: number | undefined;
  private readonly _requestContext?: RequestContextDto | undefined;
  private readonly _memberContext?: MemberContextDto | undefined;
  private readonly _error?: ErrorLoggerField | undefined;

  private constructor(
    status?: number | undefined,
    requestContext?: RequestContextDto | undefined,
    memberContext?: MemberContextDto | undefined,
    error?: ErrorLoggerField | undefined,
  ) {
    this._status = status;
    this._requestContext = requestContext;
    this._memberContext = memberContext;
    this._error = error;
  }

  public static createLog(
    status: number | undefined,
    requestContext: RequestContextDto | undefined,
    memberContext: MemberContextDto | undefined,
  ): LoggerServiceDto {
    return new LoggerServiceDto(status, requestContext, memberContext, undefined);
  }

  public static createErrorLog(
    status: number,
    requestContext: RequestContextDto | undefined,
    memberContext: MemberContextDto | undefined,
    error: ErrorLoggerField | undefined,
  ): LoggerServiceDto {
    return new LoggerServiceDto(status, requestContext, memberContext, error);
  }

  get status(): number | undefined {
    return this._status;
  }

  get requestContext(): RequestContextDto | undefined {
    return this._requestContext;
  }

  get memberContext(): MemberContextDto | undefined {
    return this._memberContext;
  }

  get error(): ErrorLoggerField | undefined {
    return this._error;
  }
}
