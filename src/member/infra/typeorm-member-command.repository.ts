import { MemberCommandRepository } from '../domain/repository/member-command.repository';
import { Member } from '../domain/entity/member.entity';
import { Injectable } from '@nestjs/common';
import { TypeormBaseRepository } from '../../global/common/infra/repository/typeorm-base.repository';
import { EntityTarget } from 'typeorm';

@Injectable()
export class TypeormMemberCommandRepository extends TypeormBaseRepository<Member> implements MemberCommandRepository {
  getName(): EntityTarget<Member> {
    return Member.name;
  }

  async existByEmail(email: string): Promise<boolean> {
    return await this.getRepository().exist({ where: { email: email } });
  }

  async findByEmail(email: string): Promise<Member | null> {
    return await this.getRepository().findOne({ where: { email: email } });
  }
}
