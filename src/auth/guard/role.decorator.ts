import { MemberRole } from '../../member/domain/enum/member-role.enum';
import { SetMetadata } from '@nestjs/common';

export const Role = (role: MemberRole) => SetMetadata('role', role);
