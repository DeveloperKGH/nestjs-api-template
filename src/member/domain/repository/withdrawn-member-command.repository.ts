import { WithdrawnMember } from '../../infra/typeorm/entity/withdrawn-member.entity';

export interface WithdrawnMemberCommandRepository {
  save(withdrawnMember: WithdrawnMember): Promise<WithdrawnMember>;
}

export const WithdrawnMemberCommandRepository = Symbol('WithdrawnMemberCommandRepository');
