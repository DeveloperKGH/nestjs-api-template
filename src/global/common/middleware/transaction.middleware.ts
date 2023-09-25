import { Injectable, NestMiddleware } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { GlobalContextUtil } from '../../util/global-context.util';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(private readonly em: EntityManager) {}
  use(_req: Request, _res: Response, next: NextFunction) {
    GlobalContextUtil.setEntityManager(this.em);
    next();
  }
}
