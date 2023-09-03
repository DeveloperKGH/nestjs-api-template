import { Module } from '@nestjs/common';
import { AdminController } from './interface/controller/admin.controller';

@Module({
  controllers: [AdminController],
})
export class AdminModule {}
