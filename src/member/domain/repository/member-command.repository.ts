import { Member } from '../entity/member.entity';

export interface MemberCommandRepository {
  save(member: Member): Promise<Member>;

  count(): Promise<number>;

  findById(id: number): Promise<Member | null>;

  existByEmail(email: string): Promise<boolean>;

  findByEmail(email: string): Promise<Member | null>;

  remove(member: Member): Promise<void>;
}

export const MemberCommandRepository = Symbol('MemberCommandRepository');
