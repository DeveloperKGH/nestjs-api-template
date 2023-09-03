import { JwtModule } from '@nestjs/jwt';
import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getJwtConfig = (): DynamicModule => {
  return JwtModule.registerAsync({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
      signOptions: {
        issuer: configService.get<string>('JWT_ISSUER'),
        expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE'),
      },
    }),
    inject: [ConfigService],
  });
};
