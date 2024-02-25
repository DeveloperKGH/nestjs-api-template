import { WithdrawnMember } from '../model/withdrawn-member.domain';

export interface WithdrawnMemberCommandRepository {
  save(withdrawnMember: WithdrawnMember): Promise<WithdrawnMember>;
}

export const WithdrawnMemberCommandRepository = Symbol('WithdrawnMemberCommandRepository');
