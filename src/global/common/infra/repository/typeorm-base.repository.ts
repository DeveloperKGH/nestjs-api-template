import { Inject } from '@nestjs/common';
import { TransactionManager } from '../../../util/transaction-manager.util';
import { EntityTarget, FindOneOptions, Repository } from 'typeorm';
import { BaseEntity } from '../../domain/entity/base.entity';

export abstract class TypeormBaseRepository<T extends BaseEntity> {
  constructor(@Inject(TransactionManager) private readonly txManger: TransactionManager) {}

  abstract getName(): EntityTarget<T>;

  async save(t: T): Promise<T> {
    return this.getRepository().save(t);
  }

  async findById(id: number): Promise<T | null> {
    const findOption: FindOneOptions = { where: { id } };
    return this.getRepository().findOne(findOption);
  }

  async remove(t: T): Promise<void> {
    await this.getRepository().remove(t);
  }

  async removeAll(t: T[]): Promise<void> {
    await this.getRepository().remove(t);
  }

  async count(): Promise<number> {
    return await this.getRepository().count();
  }

  protected getRepository(): Repository<T> {
    return this.txManger.getEntityManager().getRepository(this.getName());
  }
}
