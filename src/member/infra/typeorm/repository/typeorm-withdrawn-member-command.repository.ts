import { Injectable } from '@nestjs/common';
import { TypeormBaseCommandRepository } from '../../../../global/infra/typeorm/repository/typeorm-base-command.repository';
import { EntityTarget } from 'typeorm';
import { WithdrawnMemberEntity } from '../entity/withdrawn-member.entity';
import { WithdrawnMemberCommandRepository } from '../../../domain/repository/withdrawn-member-command.repository';
import { WithdrawnMember } from '../../../domain/model/withdrawn-member.domain';

@Injectable()
export class TypeormWithdrawnMemberCommandRepository
  extends TypeormBaseCommandRepository<WithdrawnMemberEntity>
  implements WithdrawnMemberCommandRepository
{
  getName(): EntityTarget<WithdrawnMemberEntity> {
    return WithdrawnMemberEntity.name;
  }

  async save(domain: WithdrawnMember): Promise<WithdrawnMember> {
    const savedEntity = await this.saveEntity(WithdrawnMemberEntity.fromDomain(domain));
    return savedEntity.toDomain();
  }
}
