import { Body, Controller, Patch, Post, Version } from '@nestjs/common';
import { BaseResponse } from '../../../global/common/interface/dto/response/base.response';
import { SendCodeResetPasswordRequest } from '../dto/request/send-code-reset-password.request';
import { AuthService } from '../../application/service/auth.service';
import { VerifyCodeResetPasswordRequest } from '../dto/request/verify-code-reset-password.request';
import { VerifyCodeResetPasswordResponse } from '../dto/response/verify-code-reset-password.response';
import { ResetPasswordRequest } from '../dto/request/reset-password.request';
import { RefreshTokenRequest } from '../dto/request/refresh-token.request';
import { SignInResponse } from '../dto/response/sign-in.response';

@Controller('/auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @Post('/refresh')
  async refreshAccessToken(@Body() request: RefreshTokenRequest): Promise<BaseResponse<SignInResponse>> {
    const result = await this.authService.refreshAccessToken(request.toServiceDto());
    return BaseResponse.successBaseResponse(SignInResponse.from(result));
  }

  @Version('1')
  @Post('/codes/reset-password')
  async sendCodeToResetPassword(@Body() request: SendCodeResetPasswordRequest): Promise<BaseResponse<Void>> {
    await this.authService.sendCodeToResetPassword(request.toServiceDto());
    return BaseResponse.voidBaseResponse();
  }

  @Version('1')
  @Post('/codes/reset-password/verifications')
  async verifyAuthCodeByResetPassword(
    @Body() request: VerifyCodeResetPasswordRequest,
  ): Promise<BaseResponse<VerifyCodeResetPasswordResponse>> {
    return BaseResponse.successBaseResponse(
      VerifyCodeResetPasswordResponse.fromEntity(
        await this.authService.verifyAuthCodeByResetPassword(request.toServiceDto()),
      ),
    );
  }

  @Version('1')
  @Patch('/reset-password')
  async resetPassword(@Body() request: ResetPasswordRequest): Promise<BaseResponse<Void>> {
    await this.authService.resetPassword(request.toServiceDto());
    return BaseResponse.voidBaseResponse();
  }
}
