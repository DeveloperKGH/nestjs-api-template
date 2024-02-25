import { Controller, Get, Version } from '@nestjs/common';
import { BaseResponse } from './global/interface/dto/response/base.response';

@Controller()
export class AppController {
  @Version('1')
  @Get()
  checkHealth(): BaseResponse<string> {
    return BaseResponse.successResponse('API SERVER IS RUNNING...');
  }
}
