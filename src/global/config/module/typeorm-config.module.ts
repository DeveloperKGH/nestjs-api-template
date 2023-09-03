import { Module } from '@nestjs/common';
import { TransactionManager } from '../../util/transaction-manager.util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from '../typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: TypeormConfig,
    }),
  ],
  providers: [TransactionManager],
  exports: [TransactionManager],
})
export class TypeormConfigModule {}
