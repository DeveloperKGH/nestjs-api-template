import { Injectable } from '@nestjs/common';
import { EntityTarget } from 'typeorm';
import { TypeormBaseCommandRepository } from '../../global/infra/typeorm/repository/typeorm-base-command.repository';
import { RefreshToken } from '../domain/entity/refresh-token.entity';
import { RefreshTokenCommandRepository } from '../domain/repository/refresh-token-command.repository';

@Injectable()
export class TypeormRefreshTokenCommandRepository
  extends TypeormBaseCommandRepository<RefreshToken>
  implements RefreshTokenCommandRepository
{
  getName(): EntityTarget<RefreshToken> {
    return RefreshToken.name;
  }

  async findByMemberId(memberId: number): Promise<RefreshToken | null> {
    return await this.getRepository().findOne({
      where: {
        'member.id': memberId,
      },
    } as any);
  }
}
