import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ShutDownManager } from '../shutdown.manager';
import { PasswordEncrypter } from '../../../auth/domain/password-encrypter.service';
import { PasswordBcrypter } from '../../../auth/domain/password-bcrypter.service';
import { RefreshTokenEncrypter } from '../../../auth/domain/refresh-token-encrypter.service';
import { RefreshTokenBcrypter } from '../../../auth/domain/refresh-token-bcrypter.service';
import { TransactionMiddleware } from '../../middleware/transaction.middleware';
import { NamespaceMiddleware } from '../../middleware/namespace.middleware';
import { MemberModule } from '../../../member/member.module';
import { EventListenerModule } from './event-listener.module';
import { TypeormConfigModule } from './typeorm-config.module';
import { AuthModule } from '../../../auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpStatusInterceptor } from '../../interceptor/http-status.interceptor';
import { GlobalExceptionFilter } from '../../filter/global-exception.filter';
import { WinstonConfigModule } from './winston-config.module';
import { HeaderMiddleware } from '../../middleware/header.middleware';
import { LoggingInterceptor } from '../../interceptor/logging.interceptor';

const modules = [TypeormConfigModule, WinstonConfigModule, EventListenerModule, MemberModule, AuthModule];

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
export class GlobalModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(NamespaceMiddleware, HeaderMiddleware, TransactionMiddleware).forRoutes('*');
  }
}
