import { Body, Controller, Delete, Get, Inject, Patch, Query, UseGuards, Version } from '@nestjs/common';
import { BaseResponse } from '../../../global/interface/dto/response/base.response';
import { MemberService } from '../../application/service/member.service';
import { CheckEmailDuplicationRequest } from '../dto/request/check-email-duplication.request';
import { CheckEmailDuplicationResponse } from '../dto/response/check-email-duplication.response';
import { JwtAuthGuard } from '../../../auth/guard/jwt-auth.guard';
import { MemberQueryRepository } from '../../domain/repository/member-query.repository';
import { MemberResponse } from '../dto/response/member.response';
import { MemberCondition } from '../../../global/domain/repository/dto/member.condition';
import { GlobalContextUtil } from '../../../global/util/global-context.util';
import { NotFoundException } from '../../../global/exception/not-found.exception';
import { ResetMyPasswordRequest } from '../dto/request/reset-my-password.request';
import { UpdateMyInfoRequest } from '../dto/request/update-my-info.request';

@Controller('/members')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,

    @Inject(MemberQueryRepository)
    private readonly memberQueryRepository: MemberQueryRepository,
  ) {}

  @Version('1')
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(): Promise<BaseResponse<MemberResponse>> {
    const result = await this.memberQueryRepository.find(
      MemberCondition.of(null, null, null, null, null, GlobalContextUtil.getMember().id),
    );

    if (!result) {
      throw new NotFoundException(NotFoundException.ErrorCodes.NOT_FOUND_MEMBER);
    }

    return BaseResponse.successResponse(result);
  }

  @Version('1')
  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  async updateMyInfo(@Body() request: UpdateMyInfoRequest): Promise<BaseResponse<MemberResponse>> {
    return BaseResponse.successResponse(
      MemberResponse.fromServiceDto(await this.memberService.updateMyInfo(request.toServiceDto())),
    );
  }

  @Version('1')
  @Get('/email/duplication')
  async checkEmailDuplication(
    @Query() request: CheckEmailDuplicationRequest,
  ): Promise<BaseResponse<CheckEmailDuplicationResponse>> {
    return BaseResponse.successResponse(
      CheckEmailDuplicationResponse.from(await this.memberService.checkEmailDuplication(request.toServiceDto())),
    );
  }

  @Version('1')
  @UseGuards(JwtAuthGuard)
  @Patch('/me/password')
  async resetMyPassword(@Body() request: ResetMyPasswordRequest): Promise<BaseResponse<Void>> {
    await this.memberService.resetMyPassword(request.toServiceDto());
    return BaseResponse.voidResponse();
  }

  @Version('1')
  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  async withdraw(): Promise<BaseResponse<Void>> {
    await this.memberService.withdraw();
    return BaseResponse.voidResponse();
  }
}
