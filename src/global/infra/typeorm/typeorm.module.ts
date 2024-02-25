import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeormEntityManagerInterceptor } from '../../interceptor/typeorm-entity-manager.interceptor';
import { getTypeormConnection } from './typeorm.config';

@Module({
  imports: [getTypeormConnection()],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TypeormEntityManagerInterceptor,
    },
  ],
  exports: [],
})
export class TypeormModule {}
