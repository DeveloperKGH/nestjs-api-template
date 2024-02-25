import { ValueTransformer } from 'typeorm';

export class BigintTransformer implements ValueTransformer {
  to(entityValue: number) {
    return entityValue;
  }

  from(databaseValue: string): number | null {
    return parseInt(databaseValue, 10) || null;
  }
}
