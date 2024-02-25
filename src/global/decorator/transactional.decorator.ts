import { EntityManager } from 'typeorm';
import { NAMESPACE_NESTJS_API_TEMPLATE, NAMESPACE_ENTITY_MANAGER } from '../constant/namespace.code';
import { InternalServerException } from '../exception/internal-server.exception';
import { GlobalContextUtil } from '../util/global-context.util';

export enum Propagation {
  REQUIRED,
  REQUIRES_NEW,
}

export function Transactional(options?: { propagation: Propagation }) {
  return function (_target: object, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const originMethod = descriptor.value;

    async function transactionWrapped(this: any, ...args: any[]) {
      const entityManager = GlobalContextUtil.getEntityManager();

      if (!entityManager) {
        throw new InternalServerException(
          InternalServerException.ErrorCodes.FAILED_TO_GET_NAMESPACE,
          `${NAMESPACE_NESTJS_API_TEMPLATE} 에 Entity Manager 가 없습니다.`,
        );
      }

      if (!options) {
        options = { propagation: Propagation.REQUIRED };
      }

      if (options?.propagation === Propagation.REQUIRED) {
        return await entityManager.transaction(async (tx: EntityManager) => {
          GlobalContextUtil.getMainNamespace().set(NAMESPACE_ENTITY_MANAGER, tx);
          return await originMethod.apply(this, args);
        });
      }

      if (options?.propagation === Propagation.REQUIRES_NEW) {
        const newEntityManager = new EntityManager(GlobalContextUtil.getEntityManager().connection);
        const namespace = GlobalContextUtil.getMainNamespace();

        return await namespace.runAndReturn(async () => {
          namespace.set(NAMESPACE_ENTITY_MANAGER, newEntityManager);
          return await newEntityManager.transaction(async (tx: EntityManager) => {
            namespace.set(NAMESPACE_ENTITY_MANAGER, tx);
            return await originMethod.apply(this, args);
          });
        });
      }
    }

    descriptor.value = transactionWrapped;
  };
}
