import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { GlobalModule } from './global/config/module/global.module';
import { AdminModule } from './admin/admin.module';
import { HttpAdapterHost } from '@nestjs/core';

const applicationModules = [AdminModule];

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `env/.env.${process.env.NODE_ENV}` }),
    GlobalModule,
    ...applicationModules,
  ],
  controllers: [AppController],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly refHost: HttpAdapterHost) {}

  onApplicationBootstrap(): void {
    const server = this.refHost.httpAdapter.getHttpServer();
    server.keepAliveTimeout = 61 * 1000;
    server.headersTimeout = 65 * 1000;
  }
}
