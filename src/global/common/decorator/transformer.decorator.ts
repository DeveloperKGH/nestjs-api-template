import { Transform } from 'class-transformer';
import { TimeUtil } from '../../util/time.util';
import { NumberUtil } from '../../util/number.util';
import { StringUtil } from '../../util/string.util';
import { SortOptionRequest } from '../interface/dto/request/sort-option.request';
import { BadRequestException } from '../../exception/bad-request.exception';

export function FromLocalDateTime(): PropertyDecorator {
  return Transform(({ value }) => TimeUtil.toString(value), { toPlainOnly: true });
}

export function ToLocalDateTime(): PropertyDecorator {
  return Transform(({ value }) => TimeUtil.toLocalDateTimeBy(value), { toClassOnly: true });
}

export function FromLocalDate(): PropertyDecorator {
  return Transform(({ value }) => TimeUtil.toString(value), { toPlainOnly: true });
}

export function ToLocalDate(): PropertyDecorator {
  return Transform(({ value }) => TimeUtil.toLocalDateBy(value), { toClassOnly: true });
}

export function ToNumber(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      return NumberUtil.isNumber(value) ? value : Number(value);
    },
    { toClassOnly: true },
  );
}

export function Sort(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      const sort = StringUtil.split(value, ':');

      if (!sort) {
        throw new BadRequestException(BadRequestException.ErrorCodes.INVALID_SORT_OPTION);
      }

      return [SortOptionRequest.of(sort[0], sort[1])];
    }

    return value.map((v: string) => {
      const sort = StringUtil.split(v, ':');
      if (!sort) {
        throw new BadRequestException(BadRequestException.ErrorCodes.INVALID_SORT_OPTION);
      }

      return SortOptionRequest.of(sort[0], sort[1]);
    });
  });
}
