import { DynamicModule, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { WinstonConfig } from './winston.config';
import { LoggerServiceToken } from '../logger.service';
import { WinstonLoggerService } from './winston-logger.service';

@Module({})
export class WinstonConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: WinstonConfigModule,
      imports: [WinstonModule.forRoot(WinstonConfig())],
      providers: [
        {
          provide: LoggerServiceToken,
          useClass: WinstonLoggerService,
        },
      ],
      exports: [
        {
          provide: LoggerServiceToken,
          useClass: WinstonLoggerService,
        },
      ],
    };
  }
}
