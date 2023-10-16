import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as process from 'process';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.local';
const envPath = path.resolve(__dirname, `../../env/${envFile}`);
dotenv.config({ path: envPath });

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../../src/**/*.entity.{js,ts}'],
  migrations: ['./migrations/*.ts'],
  logging: false,
  synchronize: false,
  timezone: '+00:00',
  namingStrategy: new SnakeNamingStrategy(),
});
