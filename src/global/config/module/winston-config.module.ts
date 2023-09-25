import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { WinstonConfig } from '../winston.config';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: WinstonConfig,
    }),
  ],
  providers: [],
  exports: [],
})
export class WinstonConfigModule {}
