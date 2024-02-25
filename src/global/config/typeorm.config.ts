import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Member } from '../../member/infra/typeorm/entity/member.entity';
import { WithdrawnMember } from '../../member/infra/typeorm/entity/withdrawn-member.entity';
import { RefreshToken } from '../../auth/infra/typeorm/entity/refresh-token.entity';
import { AuthCode } from '../../auth/infra/typeorm/entity/auth-code.entity';

export function getTypeormConnection() {
  return TypeOrmModule.forRootAsync({
    useFactory: async (): Promise<TypeOrmModuleOptions> => ({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Member, WithdrawnMember, RefreshToken, AuthCode],
      logging: false,
      synchronize: false,
      timezone: '+00:00',
      namingStrategy: new SnakeNamingStrategy(),
    }),
  });
}
