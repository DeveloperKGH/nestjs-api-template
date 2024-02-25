import { EntityTarget, FindOneOptions, Repository } from 'typeorm';
import { BaseEntity } from '../entity/base.entity';
import { GlobalContextUtil } from '../../../util/global-context.util';

export abstract class TypeormBaseCommandRepository<T extends BaseEntity> {
  abstract getName(): EntityTarget<T>;

  protected getRepository(): Repository<T> {
    return GlobalContextUtil.getEntityManager().getRepository(this.getName());
  }

  async saveEntity(t: T): Promise<T> {
    return this.getRepository().save(t, { transaction: false });
  }

  async findEntityById(id: number): Promise<T | null> {
    const findOption: FindOneOptions = { where: { id } };
    return this.getRepository().findOne(findOption);
  }

  async removeEntity(t: T): Promise<void> {
    await this.getRepository().remove(t, { transaction: false });
  }

  async removeEntities(t: T[]): Promise<void> {
    await this.getRepository().remove(t, { transaction: false });
  }

  async count(): Promise<number> {
    return await this.getRepository().count();
  }
}
