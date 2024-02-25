import { Global, Module } from '@nestjs/common';
import { ShutDownManager } from '../shutdown.manager';
import { PasswordEncrypterServiceToken } from '../../../auth/domain/service/password-encrypter.service';
import { PasswordBcrypterService } from '../../../auth/domain/service/password-bcrypter.service';
import { RefreshTokenEncrypterServiceToken } from '../../../auth/domain/service/refresh-token-encrypter.service';
import { RefreshTokenBcrypterService } from '../../../auth/domain/service/refresh-token-bcrypter.service';
import { MemberModule } from '../../../member/member.module';
import { EventListenerModule } from './event-listener.module';
import { AuthModule } from '../../../auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpStatusInterceptor } from '../../interceptor/http-status.interceptor';
import { GlobalExceptionFilter } from '../../filter/global-exception.filter';
import { LoggingInterceptor } from '../../interceptor/logging.interceptor';
import { WinstonConfigModule } from '../../logger/winston/winston-config.module';
import { NamespaceInterceptor } from '../../interceptor/namespace.interceptor';
import { MemberContextInterceptor } from '../../interceptor/member-context.interceptor';
import { RequestContextInterceptor } from '../../interceptor/request-context.interceptor';
import { TypeormModule } from '../../infra/typeorm/typeorm.module';

const modules = [WinstonConfigModule.forRoot(), EventListenerModule, MemberModule, AuthModule, TypeormModule];

@Global()
@Module({
  imports: [...modules],
  providers: [
    ShutDownManager,
    {
      provide: PasswordEncrypterServiceToken,
      useClass: PasswordBcrypterService,
    },
    {
      provide: RefreshTokenEncrypterServiceToken,
      useClass: RefreshTokenBcrypterService,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: NamespaceInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MemberContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpStatusInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [
    ...modules,
    {
      provide: PasswordEncrypterServiceToken,
      useClass: PasswordBcrypterService,
    },
    {
      provide: RefreshTokenEncrypterServiceToken,
      useClass: RefreshTokenBcrypterService,
    },
  ],
})
export class GlobalModule {}
