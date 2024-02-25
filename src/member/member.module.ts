import { Module } from '@nestjs/common';
import { MemberController } from './interface/controller/member.controller';
import { TypeormMemberQueryRepository } from './infra/typeorm/repository/typeorm-member-query.repository';
import { MemberQueryRepository } from './domain/repository/member-query.repository';
import { MemberService } from './application/service/member.service';
import { MemberCommandRepository } from './domain/repository/member-command.repository';
import { TypeormMemberCommandRepository } from './infra/typeorm/repository/typeorm-member-command.repository';
import { WithdrawnMemberCommandRepository } from './domain/repository/withdrawn-member-command.repository';
import { TypeormWithdrawnMemberCommandRepository } from './infra/typeorm/repository/typeorm-withdrawn-member-command.repository';

@Module({
  imports: [],
  controllers: [MemberController],
  providers: [
    MemberService,
    {
      provide: MemberCommandRepository,
      useClass: TypeormMemberCommandRepository,
    },
    {
      provide: MemberQueryRepository,
      useClass: TypeormMemberQueryRepository,
    },
    {
      provide: WithdrawnMemberCommandRepository,
      useClass: TypeormWithdrawnMemberCommandRepository,
    },
  ],
  exports: [
    MemberService,
    {
      provide: MemberCommandRepository,
      useClass: TypeormMemberCommandRepository,
    },
    {
      provide: MemberQueryRepository,
      useClass: TypeormMemberQueryRepository,
    },
  ],
})
export class MemberModule {}
