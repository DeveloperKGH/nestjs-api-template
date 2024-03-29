import { Module } from '@nestjs/common';
import { SignController } from './interface/controller/sign.controller';
import { SignService } from './application/service/sign.service';
import { PasswordBcrypterService } from './domain/service/password-bcrypter.service';
import { MemberModule } from '../member/member.module';
import { JwtTokenService } from './application/service/jwt-token.service';
import { getJwtConfig } from '../global/config/jwt.config';
import { AuthController } from './interface/controller/auth.controller';
import { AuthService } from './application/service/auth.service';
import { EmailModule } from '../global/infra/email/email.module';
import { TypeormAuthCodeCommandRepository } from './infra/typeorm/repository/typeorm-auth-code-command.repository';
import { AuthCodeCommandRepository } from './domain/repository/auth-code-command.repository';
import { RefreshTokenCommandRepository } from './domain/repository/refresh-token-command.repository';
import { TypeormRefreshTokenCommandRepository } from './infra/typeorm/repository/typeorm-refresh-token-command.repository';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtStrategy } from './guard/strategy/jwt.strategy';

@Module({
  imports: [MemberModule, EmailModule, getJwtConfig()],
  controllers: [SignController, AuthController],
  providers: [
    SignService,
    AuthService,
    PasswordBcrypterService,
    JwtTokenService,
    {
      provide: AuthCodeCommandRepository,
      useClass: TypeormAuthCodeCommandRepository,
    },
    {
      provide: RefreshTokenCommandRepository,
      useClass: TypeormRefreshTokenCommandRepository,
    },
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [JwtAuthGuard, AuthService, JwtTokenService],
})
export class AuthModule {}
