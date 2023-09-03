import { LocalDateTime } from '@js-joda/core';
import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';
import { LocalDateTimeTransformer } from '../../infra/transformer/local-date-time.transformer';
import { BaseEntity } from './base.entity';
import { BigintTransformer } from '../../infra/transformer/bigint.transformer';
import { GlobalContextUtil } from '../../../util/global-context.util';

export abstract class BaseAuditEntity extends BaseEntity {
  @Column({ type: 'bigint', unsigned: true, transformer: new BigintTransformer() })
  public createdBy: number;

  @Column({ type: 'bigint', unsigned: true, transformer: new BigintTransformer() })
  public updatedBy: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', transformer: new LocalDateTimeTransformer() })
  public createdAt: LocalDateTime;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: new LocalDateTimeTransformer(),
  })
  public updatedAt: LocalDateTime;

  @BeforeInsert()
  protected beforeInsert() {
    this.createdBy = GlobalContextUtil.getMember().id;
    this.updatedBy = GlobalContextUtil.getMember().id;
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @BeforeUpdate()
  protected beforeUpdate() {
    this.updatedBy = GlobalContextUtil.getMember().id;
    this.updatedAt = LocalDateTime.now();
  }
}
