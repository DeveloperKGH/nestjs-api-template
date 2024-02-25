import { Injectable } from '@nestjs/common';
import { Between, EntityTarget } from 'typeorm';
import { AuthCodeCommandRepository } from '../../../domain/repository/auth-code-command.repository';
import { AuthCodeEntity } from '../entity/auth-code.entity';
import { AuthCodeType } from '../../../domain/enum/auth-code-type.enum';
import { TimeUtil } from '../../../../global/util/time.util';
import { TypeormBaseCommandRepository } from '../../../../global/infra/typeorm/repository/typeorm-base-command.repository';
import { AuthCode } from '../../../domain/model/auth-code.domain';
import { isEmpty } from '../../../../global/util/common.util';

@Injectable()
export class TypeormAuthCodeCommandRepository
  extends TypeormBaseCommandRepository<AuthCodeEntity>
  implements AuthCodeCommandRepository
{
  getName(): EntityTarget<AuthCodeEntity> {
    return AuthCodeEntity.name;
  }

  async save(domain: AuthCode): Promise<AuthCode> {
    const savedEntity = await this.saveEntity(AuthCodeEntity.fromDomain(domain));
    return savedEntity.toDomain();
  }

  async findAllByMemberIdAndTypeAndCreatedAtToday(memberId: number, type: AuthCodeType): Promise<AuthCode[]> {
    const from = TimeUtil.getStartOfTodayInKSTAsUTC();
    const to = TimeUtil.getEndOfTodayInKSTAsUTC();
    const foundEntities = await this.getRepository().find({
      where: {
        'member.id': memberId,
        type: type,
        createdAt: Between(from, to),
      },
    } as any);

    return foundEntities.map(e => e.toDomain());
  }

  async findByCode(code: string): Promise<AuthCode | null> {
    const foundEntity = await this.getRepository().findOne({ where: { code: code } } as any);

    return isEmpty(foundEntity) ? null : foundEntity!.toDomain();
  }

  async findAllByMemberId(memberId: number): Promise<AuthCode[]> {
    const foundEntities = await this.getRepository().find({ where: { 'member.id': memberId } } as any);
    return foundEntities.map(e => e.toDomain());
  }

  async remove(authCode: AuthCode): Promise<void> {
    return this.removeEntity(AuthCodeEntity.fromDomain(authCode));
  }

  async removeAll(authCodes: AuthCode[]): Promise<void> {
    return this.removeEntities(authCodes.map(a => AuthCodeEntity.fromDomain(a)));
  }
}
