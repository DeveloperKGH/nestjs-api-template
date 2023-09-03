import { BaseRequest } from './base.request';
import { MemberCondition } from '../../../domain/repository/dto/member.condition';
import { MemberRole } from '../../../../../member/domain/enum/member-role.enum';

export class SearchMemberRequest extends BaseRequest {
  public toCondition(): MemberCondition {
    return MemberCondition.of(
      this.page,
      this.size,
      this.lastId,
      this.sort?.map(s => s.toCondition()),
      null,
      null,
      MemberRole.MEMBER,
    );
  }
}
