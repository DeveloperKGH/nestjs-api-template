import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { createNamespace, getNamespace } from 'cls-hooked';
import { NAMESPACE_NESTJS_API_TEMPLATE } from '../constant/namespace.code';
import { Observable } from 'rxjs';

@Injectable()
export class NamespaceInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const namespace = getNamespace(NAMESPACE_NESTJS_API_TEMPLATE) ?? createNamespace(NAMESPACE_NESTJS_API_TEMPLATE);

    return new Observable(observer => {
      namespace.run(() => {
        next.handle().subscribe({
          next: value => observer.next(value),
          error: error => observer.error(error),
          complete: () => observer.complete(),
        });
      });
    });
  }
}
