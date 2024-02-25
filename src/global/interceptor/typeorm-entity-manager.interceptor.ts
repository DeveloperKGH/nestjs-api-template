import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Observable } from 'rxjs';
import { GlobalContextUtil } from '../util/global-context.util';

@Injectable()
export class TypeormEntityManagerInterceptor implements NestInterceptor {
  constructor(private readonly entityManager: EntityManager) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    GlobalContextUtil.setEntityManager(this.entityManager);

    return next.handle();
  }
}
