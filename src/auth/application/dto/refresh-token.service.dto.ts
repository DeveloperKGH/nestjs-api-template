export class RefreshTokenServiceDto {
  private readonly _refreshToken!: string;

  private constructor(refreshToken: string) {
    this._refreshToken = refreshToken;
  }

  public static of(refreshToken: string): RefreshTokenServiceDto {
    return new RefreshTokenServiceDto(refreshToken);
  }

  get refreshToken(): string {
    return this._refreshToken;
  }
}
