import { MemberCondition } from '../../../global/common/domain/repository/dto/member.condition';
import { MemberResponse } from '../../interface/dto/response/member.response';
import { PagingResponse } from '../../../global/common/interface/dto/response/paging.response';

export interface MemberQueryRepository {
  find(condition: MemberCondition): Promise<MemberResponse | null>;

  findAll(condition: MemberCondition): Promise<MemberResponse[] | PagingResponse<MemberResponse> | []>;
}

export const MemberQueryRepository = Symbol('MemberQueryRepository');
