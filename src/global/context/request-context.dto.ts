import { cloneDeep } from 'lodash';
import { StringUtil } from '../util/string.util';
import { LocalDateTime } from '@js-joda/core';
import { RandomUtil } from '../util/random.util';

export class RequestContextDto {
  private static readonly SENSITIVE_FIELDS = ['password'];

  private readonly _transactionId: string;
  private readonly _ip: string;
  private readonly _userAgent: string | undefined;
  private readonly _httpMethod: string;
  private readonly _url: string;
  private readonly _requestBody: any;
  private readonly _queryParams: any;
  private readonly _startTime: LocalDateTime;

  private constructor(
    transactionId: string,
    ip: string,
    userAgent: string | undefined,
    httpMethod: string,
    url: string,
    requestBody: any,
    queryParams: any,
    startTime: LocalDateTime,
  ) {
    this._transactionId = transactionId;
    this._ip = ip;
    this._userAgent = userAgent;
    this._httpMethod = httpMethod;
    this._url = url;
    this._requestBody = this.maskSensitiveFields(cloneDeep(requestBody));
    this._queryParams = this.maskSensitiveFields(cloneDeep(queryParams));
    this._startTime = startTime;
  }

  public static of(
    ip: string,
    userAgent: string | undefined,
    httpMethod: string,
    url: string,
    requestBody: any,
    queryParams: any,
  ): RequestContextDto {
    return new RequestContextDto(
      RandomUtil.generateUuidV4(),
      ip,
      userAgent,
      httpMethod,
      url,
      requestBody,
      queryParams,
      LocalDateTime.now(),
    );
  }

  public static createDefault(
    ip: string,
    userAgent: string | undefined,
    httpMethod: string,
    url: string,
    requestBody: any,
    queryParams: any,
  ) {
    return new RequestContextDto(
      RandomUtil.generateUuidV4(),
      ip,
      userAgent,
      httpMethod,
      url,
      requestBody,
      queryParams,
      LocalDateTime.now(),
    );
  }

  get transactionId(): string {
    return this._transactionId;
  }

  get ip(): string {
    return this._ip;
  }

  get userAgent(): string | undefined {
    return this._userAgent;
  }

  get httpMethod(): string {
    return this._httpMethod;
  }

  get url(): string {
    return this._url;
  }

  get requestBody(): string {
    return this._requestBody;
  }

  get queryParams(): any {
    return this._queryParams;
  }

  get startTime(): LocalDateTime {
    return this._startTime;
  }

  private maskSensitiveFields(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        obj[key] = this.maskSensitiveFields(obj[key]);
        return;
      }

      if (RequestContextDto.SENSITIVE_FIELDS.includes(key)) {
        obj[key] = StringUtil.mask(obj[key]);
      }
    });

    return obj;
  }
}
