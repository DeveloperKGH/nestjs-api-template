import { MemberCommandRepository } from '../../../domain/repository/member-command.repository';
import { Member } from '../entity/member.entity';
import { Injectable } from '@nestjs/common';
import { TypeormBaseCommandRepository } from '../../../../global/infra/typeorm/repository/typeorm-base-command.repository';
import { EntityTarget } from 'typeorm';

@Injectable()
export class TypeormMemberCommandRepository
  extends TypeormBaseCommandRepository<Member>
  implements MemberCommandRepository
{
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
