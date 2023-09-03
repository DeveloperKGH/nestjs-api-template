import { Controller, Get, Inject, Query, UseGuards, Version } from '@nestjs/common';
import { BaseResponse } from '../../../global/common/interface/dto/response/base.response';
import { JwtAuthGuard } from '../../../auth/guard/jwt-auth.guard';
import { RoleGuard } from '../../../auth/guard/role.guard';
import { Role } from '../../../auth/guard/role.decorator';
import { MemberRole } from '../../../member/domain/enum/member-role.enum';
import { MemberQueryRepository } from '../../../member/domain/repository/member-query.repository';
import { SearchMemberRequest } from '../../../global/common/interface/dto/request/search-member.request';
import { MemberResponse } from '../../../member/interface/dto/response/member.response';
import { PagingResponse } from '../../../global/common/interface/dto/response/paging.response';

@Controller('/admin')
export class AdminController {
  constructor(
    @Inject(MemberQueryRepository)
    private readonly memberQueryRepository: MemberQueryRepository,
  ) {}

  @Version('1')
  @Role(MemberRole.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/members')
  async getMembers(
    @Query() request: SearchMemberRequest,
  ): Promise<BaseResponse<MemberResponse[] | PagingResponse<MemberResponse> | []>> {
    const result = await this.memberQueryRepository.findAll(request.toCondition());
    return BaseResponse.successBaseResponse(result);
  }
}
