import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ShutDownManager } from '../shutdown.manager';
import { PasswordEncrypter } from '../../../auth/domain/password-encrypter.service';
import { PasswordBcrypter } from '../../../auth/domain/password-bcrypter.service';
import { RefreshTokenEncrypter } from '../../../auth/domain/refresh-token-encrypter.service';
import { RefreshTokenBcrypter } from '../../../auth/domain/refresh-token-bcrypter.service';
import { TransactionMiddleware } from '../../common/middleware/transaction.middleware';
import { NamespaceMiddleware } from '../../common/middleware/namespace.middleware';
import { MemberMiddleware } from '../../common/middleware/member.middleware';
import { MemberModule } from '../../../member/member.module';
import { EventListenerModule } from './event-listener.module';
import { TypeormConfigModule } from './typeorm-config.module';
import { AuthModule } from '../../../auth/auth.module';

const modules = [TypeormConfigModule, EventListenerModule, MemberModule, AuthModule];

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
    consumer.apply(NamespaceMiddleware, TransactionMiddleware, MemberMiddleware).forRoutes('*');
  }
}
