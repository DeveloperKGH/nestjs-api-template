import { getNamespace } from 'cls-hooked';
import {
  NAMESPACE_NESTJS_API_TEMPLATE,
  NAMESPACE_ENTITY_MANAGER,
  NAMESPACE_MEMBER,
  NAMESPACE_REQUEST_CONTEXT,
} from '../constant/namespace.code';
import { InternalServerException } from '../exception/internal-server.exception';
import { EntityManager } from 'typeorm';
import { MemberContextDto } from '../context/member-context.dto';
import { RequestContextDto } from '../context/request-context.dto';

export class GlobalContextUtil {
  public static getMainNamespace(): any {
    const namespace = getNamespace(NAMESPACE_NESTJS_API_TEMPLATE);

    if (!namespace || !namespace.active) {
      throw new InternalServerException(InternalServerException.ErrorCodes.FAILED_TO_GET_NAMESPACE);
    }

    return namespace;
  }

  public static setMember(context: MemberContextDto): void {
    this.getMainNamespace().set(NAMESPACE_MEMBER, context);
  }

  public static getMember(): MemberContextDto {
    return this.getMainNamespace().get(NAMESPACE_MEMBER);
  }

  public static setEntityManager(em: EntityManager): void {
    this.getMainNamespace().set(NAMESPACE_ENTITY_MANAGER, em);
  }

  public static getEntityManager(): EntityManager {
    return this.getMainNamespace().get(NAMESPACE_ENTITY_MANAGER);
  }

  public static setRequestContext(context: RequestContextDto): void {
    this.getMainNamespace().set(NAMESPACE_REQUEST_CONTEXT, context);
  }

  public static getRequestContext(): RequestContextDto {
    return this.getMainNamespace().get(NAMESPACE_REQUEST_CONTEXT);
  }
}
