import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { GlobalContextUtil } from './global-context.util';

@Injectable()
export class TransactionManager {
  getEntityManager(): EntityManager {
    return GlobalContextUtil.getEntityManager();
  }
}
