import {
  convert,
  DateTimeFormatter,
  Duration,
  LocalDate,
  LocalDateTime,
  LocalTime,
  nativeJs,
  ZonedDateTime,
  ZoneId,
  ZoneOffset,
} from '@js-joda/core';
import '@js-joda/timezone';
import { BadRequestException } from '../exception/bad-request.exception';

export class TimeUtil {
  private static readonly DATE_FORMATTER = DateTimeFormatter.ofPattern('yyyy-MM-dd');
  private static readonly DATE_TIME_FORMATTER = DateTimeFormatter.ISO_ZONED_DATE_TIME;
  private static readonly UTC_ZONE_ID = ZoneId.of('UTC');
  private static readonly KST_ZONE_ID = ZoneId.of('Asia/Seoul');
  private static readonly ISO_8601_REGEXP = new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);

  static toString(value: LocalDate | LocalDateTime): string | null {
    if (!value) {
      return null;
    }

    if (value instanceof LocalDate) {
      return value.format(this.DATE_FORMATTER);
    }

    return value.atOffset(ZoneOffset.UTC).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
  }

  static toDate(localDate: LocalDate | LocalDateTime): Date | null {
    if (!localDate) {
      return null;
    }

    return convert(localDate).toDate();
  }

  static toLocalDate(date: Date): LocalDate | null {
    if (!date) {
      return null;
    }
    return LocalDate.from(nativeJs(date));
  }

  static toLocalDateTime(date: Date): LocalDateTime | null {
    if (!date) {
      return null;
    }
    return LocalDateTime.from(nativeJs(date));
  }

  static toLocalDateBy(strDate: string): LocalDate | null {
    if (!strDate) {
      return null;
    }

    return LocalDate.parse(strDate, TimeUtil.DATE_FORMATTER);
  }

  static toLocalDateTimeBy(strDate: string): LocalDateTime | null {
    if (!strDate) {
      return null;
    }

    if (!this.ISO_8601_REGEXP.test(strDate)) {
      throw new BadRequestException(BadRequestException.ErrorCodes.INVALID_ISO_8601_FORMAT);
    }

    return ZonedDateTime.parse(strDate, this.DATE_TIME_FORMATTER).toLocalDateTime();
  }

  static getStartOfTodayInKSTAsUTC(): LocalDateTime {
    return ZonedDateTime.of(LocalDateTime.of(LocalDate.now(TimeUtil.KST_ZONE_ID), LocalTime.MIN), TimeUtil.KST_ZONE_ID)
      .withZoneSameInstant(TimeUtil.UTC_ZONE_ID)
      .toLocalDateTime();
  }

  static getEndOfTodayInKSTAsUTC(): LocalDateTime {
    return ZonedDateTime.of(LocalDateTime.of(LocalDate.now(TimeUtil.KST_ZONE_ID), LocalTime.MAX), TimeUtil.KST_ZONE_ID)
      .withZoneSameInstant(TimeUtil.UTC_ZONE_ID)
      .toLocalDateTime();
  }

  static getMillisOfDuration(from: LocalDateTime, to: LocalDateTime): number {
    return Duration.between(from, to).toMillis();
  }
}
