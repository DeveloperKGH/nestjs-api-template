import { Global, Module } from '@nestjs/common';
import { ShutDownManager } from '../shutdown.manager';
import { PasswordEncrypter } from '../../../auth/domain/password-encrypter.service';
import { PasswordBcrypter } from '../../../auth/domain/password-bcrypter.service';
import { RefreshTokenEncrypter } from '../../../auth/domain/refresh-token-encrypter.service';
import { RefreshTokenBcrypter } from '../../../auth/domain/refresh-token-bcrypter.service';
import { MemberModule } from '../../../member/member.module';
import { EventListenerModule } from './event-listener.module';
import { AuthModule } from '../../../auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpStatusInterceptor } from '../../interceptor/http-status.interceptor';
import { GlobalExceptionFilter } from '../../filter/global-exception.filter';
import { LoggingInterceptor } from '../../interceptor/logging.interceptor';
import { WinstonConfigModule } from '../../logger/winston/winston-config.module';
import { getTypeormConnection } from '../typeorm.config';
import { NamespaceInterceptor } from '../../interceptor/namespace.interceptor';
import { TypeormEntityManagerInterceptor } from '../../interceptor/typeorm-entity-manager.interceptor';
import { MemberContextInterceptor } from '../../interceptor/member-context.interceptor';
import { RequestContextInterceptor } from '../../interceptor/request-context.interceptor';

const modules = [getTypeormConnection(), WinstonConfigModule.forRoot(), EventListenerModule, MemberModule, AuthModule];

@Global()
@Module({
  imports: [...modules],
  providers: [
    ShutDownManager,
    {
      provide: PasswordEncrypter,
      useClass: PasswordBcrypter,
    },
    {
      provide: RefreshTokenEncrypter,
      useClass: RefreshTokenBcrypter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: NamespaceInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TypeormEntityManagerInterceptor,
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
      provide: PasswordEncrypter,
      useClass: PasswordBcrypter,
    },
    {
      provide: RefreshTokenEncrypter,
      useClass: RefreshTokenBcrypter,
    },
  ],
})
export class GlobalModule {}
