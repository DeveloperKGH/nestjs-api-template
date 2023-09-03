import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { NAMESPACE_MEMBER } from '../constant/namespace.code';
import { GlobalContextUtil } from '../../util/global-context.util';

@Injectable()
export class MemberMiddleware implements NestMiddleware {
  use(_req: Request, _res: Response, next: NextFunction) {
    const namespace = GlobalContextUtil.getMainNamespace();

    namespace.run(() => {
      namespace.set(NAMESPACE_MEMBER, 'sample');
      next();
    });
  }
}
