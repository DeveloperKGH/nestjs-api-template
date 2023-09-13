import { Injectable, NestMiddleware } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { NextFunction } from 'express';
import { NAMESPACE_ENTITY_MANAGER } from '../constant/namespace.code';
import { GlobalContextUtil } from '../../util/global-context.util';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(private readonly em: EntityManager) {}
  use(_req: Request, _res: Response, next: NextFunction) {
    const namespace = GlobalContextUtil.getMainNamespace();
    namespace.set(NAMESPACE_ENTITY_MANAGER, this.em);
    next();
  }
}
