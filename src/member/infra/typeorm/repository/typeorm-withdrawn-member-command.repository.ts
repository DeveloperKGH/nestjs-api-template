import { Injectable } from '@nestjs/common';
import { TypeormBaseCommandRepository } from '../../../../global/infra/typeorm/repository/typeorm-base-command.repository';
import { EntityTarget } from 'typeorm';
import { WithdrawnMember } from '../entity/withdrawn-member.entity';
import { WithdrawnMemberCommandRepository } from '../../../domain/repository/withdrawn-member-command.repository';

@Injectable()
export class TypeormWithdrawnMemberCommandRepository
  extends TypeormBaseCommandRepository<WithdrawnMember>
  implements WithdrawnMemberCommandRepository
{
  getName(): EntityTarget<WithdrawnMember> {
    return WithdrawnMember.name;
  }
}
