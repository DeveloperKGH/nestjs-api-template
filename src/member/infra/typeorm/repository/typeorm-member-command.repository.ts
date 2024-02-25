import { MemberCommandRepository } from '../../../domain/repository/member-command.repository';
import { MemberEntity } from '../entity/member.entity';
import { Injectable } from '@nestjs/common';
import { TypeormBaseCommandRepository } from '../../../../global/infra/typeorm/repository/typeorm-base-command.repository';
import { EntityTarget } from 'typeorm';
import { Member } from '../../../domain/model/member.domain';
import { isEmpty } from '../../../../global/util/common.util';

@Injectable()
export class TypeormMemberCommandRepository
  extends TypeormBaseCommandRepository<MemberEntity>
  implements MemberCommandRepository
{
  getName(): EntityTarget<MemberEntity> {
    return MemberEntity.name;
  }

  async save(domain: Member): Promise<Member> {
    const savedEntity = await this.saveEntity(MemberEntity.fromDomain(domain));
    return savedEntity.toDomain();
  }

  async existByEmail(email: string): Promise<boolean> {
    return await this.getRepository().exist({ where: { email: email } });
  }

  async findByEmail(email: string): Promise<Member | null> {
    const foundEntity = await this.getRepository().findOne({ where: { email: email } });
    return isEmpty(foundEntity) ? null : foundEntity!.toDomain();
  }

  async findById(id: number): Promise<Member | null> {
    const foundEntity = await this.findEntityById(id);
    return isEmpty(foundEntity) ? null : foundEntity!.toDomain();
  }

  async remove(member: Member): Promise<void> {
    return this.removeEntity(MemberEntity.fromDomain(member));
  }
}
