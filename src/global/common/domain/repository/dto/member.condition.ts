import { BaseCondition } from './base.condition';
import { MemberRole } from '../../../../../member/domain/enum/member-role.enum';
import { SortOptionCondition } from './sort-option.condition';

export class MemberCondition extends BaseCondition {
  email?: string | null | undefined;

  id?: number | null | undefined;

  role?: string | null | undefined;

  private constructor(
    page?: number | null | undefined,
    size?: number | null | undefined,
    lastId?: number | null | undefined,
    sort?: SortOptionCondition[] | null | undefined,
    email?: string | null | undefined,
    id?: number | null | undefined,
    role?: MemberRole | null | undefined,
  ) {
    super(page, size, lastId, sort);
    this.email = email;
    this.id = id;
    this.role = role?.code;
  }

  public static of(
    page?: number | null | undefined,
    size?: number | null | undefined,
    lastId?: number | null | undefined,
    sort?: SortOptionCondition[] | null | undefined,
    email?: string | null,
    id?: number | null,
    role?: MemberRole | null | undefined,
  ): MemberCondition {
    return new MemberCondition(page, size, lastId, sort, email, id, role);
  }
}
