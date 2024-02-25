import { JwtModule } from '@nestjs/jwt';
import { DynamicModule } from '@nestjs/common';
import * as process from 'process';

export const getJwtConfig = (): DynamicModule => {
  return JwtModule.registerAsync({
    useFactory: async () => ({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      signOptions: {
        issuer: process.env.JWT_ISSUER,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
      },
    }),
  });
};
