import { cloneDeep } from 'lodash';
import { StringUtil } from '../util/string.util';
import { LocalDateTime } from '@js-joda/core';

export class HeaderContextDto {
  private static readonly SENSITIVE_FIELDS = ['password'];

  private readonly _transactionId: string;
  private readonly _userAgent: string | undefined;
  private readonly _ip: string;
  private readonly _httpMethod: string;
  private readonly _url: string;
  private readonly _requestBody: any;
  private readonly _queryParams: any;
  private readonly _startTime: LocalDateTime;

  private constructor(
    transactionId: string,
    userAgent: string | undefined,
    ip: string,
    httpMethod: string,
    url: string,
    requestBody: any,
    queryParams: any,
    startTime: LocalDateTime,
  ) {
    this._transactionId = transactionId;
    this._userAgent = userAgent;
    this._ip = ip;
    this._httpMethod = httpMethod;
    this._url = url;
    this._requestBody = requestBody;
    this._queryParams = queryParams;
    this._startTime = startTime;
  }

  public static of(
    transactionId: string,
    userAgent: string | undefined,
    ip: string,
    httpMethod: string,
    url: string,
    requestBody: any,
    queryParams: any,
    startTime: LocalDateTime,
  ): HeaderContextDto {
    requestBody = this.maskSensitiveFields(cloneDeep(requestBody));
    queryParams = this.maskSensitiveFields(cloneDeep(queryParams));

    return new HeaderContextDto(transactionId, userAgent, ip, httpMethod, url, requestBody, queryParams, startTime);
  }

  get transactionId(): string {
    return this._transactionId;
  }

  get userAgent(): string | undefined {
    return this._userAgent;
  }

  get ip(): string {
    return this._ip;
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

  private static maskSensitiveFields(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        obj[key] = HeaderContextDto.maskSensitiveFields(obj[key]);
        return;
      }

      if (this.SENSITIVE_FIELDS.includes(key)) {
        obj[key] = StringUtil.mask(obj[key]);
      }
    });

    return obj;
  }
}
