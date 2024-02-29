export class UpdateMyInfoServiceDto {
  private readonly _name?: string | undefined;

  private constructor(name: string | undefined) {
    this._name = name;
  }

  public static of(name: string | undefined): UpdateMyInfoServiceDto {
    return new UpdateMyInfoServiceDto(name);
  }

  get name(): string | undefined {
    return this._name;
  }
}
