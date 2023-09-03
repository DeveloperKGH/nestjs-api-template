import { ValueTransformer } from 'typeorm';
import { MemberRole } from '../../domain/enum/member-role.enum';

export class MemberRoleTransformer implements ValueTransformer {
  to(entityValue: MemberRole): string | null {
    if (!entityValue) {
      return null;
    }

    return entityValue.enumName;
  }

  from(databaseValue: string): MemberRole | null {
    if (!databaseValue) {
      return null;
    }

    return MemberRole.valueByName(databaseValue);
  }
}
