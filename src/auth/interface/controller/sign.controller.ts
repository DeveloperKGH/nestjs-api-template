import { Body, Controller, Post, Version } from '@nestjs/common';
import { SignUpRequest } from '../dto/request/sign-up.request';
import { SignService } from '../../application/service/sign.service';
import { BaseResponse } from '../../../global/common/interface/dto/response/base.response';
import { SignInRequest } from '../dto/request/sign-in.request';
import { SignInResponse } from '../dto/response/sign-in.response';

@Controller()
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Version('1')
  @Post('sign-up')
  async signUp(@Body() request: SignUpRequest): Promise<BaseResponse<Void>> {
    await this.signService.signUp(request.toServiceDto());
    return BaseResponse.voidBaseResponse();
  }

  @Version('1')
  @Post('sign-in')
  async signIn(@Body() request: SignInRequest): Promise<BaseResponse<SignInResponse>> {
    return BaseResponse.successBaseResponse(SignInResponse.from(await this.signService.signIn(request.toServiceDto())));
  }
}
