import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setNestApp } from './global/config/nest-app.config';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setNestApp(app);
  await app.listen(Number(process.env.SERVER_PORT));
}

bootstrap();
