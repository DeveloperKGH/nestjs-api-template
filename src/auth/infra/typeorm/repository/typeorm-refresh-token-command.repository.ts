import { Injectable } from '@nestjs/common';
import { EntityTarget } from 'typeorm';
import { TypeormBaseCommandRepository } from '../../../../global/infra/typeorm/repository/typeorm-base-command.repository';
import { RefreshTokenEntity } from '../entity/refresh-token.entity';
import { RefreshTokenCommandRepository } from '../../../domain/repository/refresh-token-command.repository';
import { RefreshToken } from '../../../domain/model/refresh-token.domain';
import { isEmpty } from '../../../../global/util/common.util';

@Injectable()
export class TypeormRefreshTokenCommandRepository
  extends TypeormBaseCommandRepository<RefreshTokenEntity>
  implements RefreshTokenCommandRepository
{
  getName(): EntityTarget<RefreshTokenEntity> {
    return RefreshTokenEntity.name;
  }

  async save(domain: RefreshToken): Promise<RefreshToken> {
    const savedEntity = await this.saveEntity(RefreshTokenEntity.fromDomain(domain));
    return savedEntity.toDomain();
  }

  async findByMemberId(memberId: number): Promise<RefreshToken | null> {
    const foundEntity = await this.getRepository().findOne({
      where: {
        'member.id': memberId,
      },
    } as any);
    return isEmpty(foundEntity) ? null : foundEntity!.toDomain();
  }

  async remove(domain: RefreshToken): Promise<void> {
    await this.removeEntity(RefreshTokenEntity.fromDomain(domain));
  }
}
