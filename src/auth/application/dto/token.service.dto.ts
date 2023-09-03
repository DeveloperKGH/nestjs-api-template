export class TokenServiceDto {
  private readonly _accessToken!: string;
  private readonly _refreshToken!: string;

  private constructor(accessToken: string, refreshToken: string) {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
  }

  public static of(accessToken: string, refreshToken: string): TokenServiceDto {
    return new TokenServiceDto(accessToken, refreshToken);
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }
}
