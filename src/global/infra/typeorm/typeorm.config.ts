import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MemberEntity } from '../../../member/infra/typeorm/entity/member.entity';
import { WithdrawnMemberEntity } from '../../../member/infra/typeorm/entity/withdrawn-member.entity';
import { RefreshTokenEntity } from '../../../auth/infra/typeorm/entity/refresh-token.entity';
import { AuthCodeEntity } from '../../../auth/infra/typeorm/entity/auth-code.entity';

export function getTypeormConnection() {
  return TypeOrmModule.forRootAsync({
    useFactory: async (): Promise<TypeOrmModuleOptions> => ({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [MemberEntity, WithdrawnMemberEntity, RefreshTokenEntity, AuthCodeEntity],
      logging: false,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
      timezone: 'Z',
      bigNumberStrings: false,
      connectTimeout: 30000,
      extra: {
        waitForConnections: true,
        connectionLimit: process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'dev' ? 10 : 30,
        queueLimit: 0,
      },
    }),
  });
}
