import { Injectable } from '@nestjs/common';
import { TypeormBaseRepository } from '../../global/common/infra/repository/typeorm-base.repository';
import { EntityTarget } from 'typeorm';
import { WithdrawnMember } from '../domain/entity/withdrawn-member.entity';
import { WithdrawnMemberCommandRepository } from '../domain/repository/withdrawn-member-command.repository';

@Injectable()
export class TypeormWithdrawnMemberCommandRepository
  extends TypeormBaseRepository<WithdrawnMember>
  implements WithdrawnMemberCommandRepository
{
  getName(): EntityTarget<WithdrawnMember> {
    return WithdrawnMember.name;
  }
}
