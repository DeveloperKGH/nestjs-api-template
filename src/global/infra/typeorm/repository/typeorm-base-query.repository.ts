import { EntityTarget, Repository } from 'typeorm';
import { BaseEntity } from '../../../domain/entity/base.entity';
import { GlobalContextUtil } from '../../../util/global-context.util';

export abstract class TypeormBaseQueryRepository<T extends BaseEntity> {
  abstract getName(): EntityTarget<T>;

  protected getRepository(): Repository<T> {
    return GlobalContextUtil.getEntityManager().getRepository(this.getName());
  }
}
