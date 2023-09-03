import { LocalDateTime } from '@js-joda/core';
import { TimeUtil } from '../../../util/time.util';
import { ValueTransformer } from 'typeorm';

export class LocalDateTimeTransformer implements ValueTransformer {
  to(entityValue: LocalDateTime): Date | null {
    if (entityValue instanceof Date) {
      return entityValue;
    }

    return TimeUtil.toDate(entityValue);
  }

  from(databaseValue: Date): LocalDateTime | null {
    if (databaseValue instanceof LocalDateTime) {
      return databaseValue;
    }

    return TimeUtil.toLocalDateTime(databaseValue);
  }
}
