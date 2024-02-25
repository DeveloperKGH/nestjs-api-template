import { Injectable } from '@nestjs/common';
import { Between, EntityTarget } from 'typeorm';
import { AuthCodeCommandRepository } from '../../../domain/repository/auth-code-command.repository';
import { AuthCode } from '../entity/auth-code.entity';
import { AuthCodeType } from '../../../domain/enum/auth-code-type.enum';
import { TimeUtil } from '../../../../global/util/time.util';
import { TypeormBaseCommandRepository } from '../../../../global/infra/typeorm/repository/typeorm-base-command.repository';

@Injectable()
export class TypeormAuthCodeCommandRepository
  extends TypeormBaseCommandRepository<AuthCode>
  implements AuthCodeCommandRepository
{
  getName(): EntityTarget<AuthCode> {
    return AuthCode.name;
  }

  async findAllByMemberIdAndTypeAndCreatedAtToday(memberId: number, type: AuthCodeType): Promise<AuthCode[]> {
    const from = TimeUtil.getStartOfTodayInKSTAsUTC();
    const to = TimeUtil.getEndOfTodayInKSTAsUTC();

    return await this.getRepository().find({
      where: {
        'member.id': memberId,
        type: type,
        createdAt: Between(from, to),
      },
    } as any);
  }

  async findByCode(code: string): Promise<AuthCode | null> {
    return await this.getRepository().findOne({ where: { code: code } } as any);
  }

  async findAllByMemberId(memberId: number): Promise<AuthCode[]> {
    return await this.getRepository().find({ where: { 'member.id': memberId } } as any);
  }
}
