import { ValueTransformer } from 'typeorm';

export class BooleanTransformer implements ValueTransformer {
  to(entityValue: boolean): number {
    return entityValue ? 1 : 0;
  }

  from(databaseValue: number): boolean {
    return Boolean(databaseValue);
  }
}
