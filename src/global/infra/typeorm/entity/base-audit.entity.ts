import { LocalDateTime } from '@js-joda/core';
import { BeforeInsert, BeforeUpdate, Column } from 'typeorm';
import { LocalDateTimeTransformer } from '../transformer/local-date-time.transformer';
import { BaseEntity } from './base.entity';
import { GlobalContextUtil } from '../../../util/global-context.util';

export abstract class BaseAuditEntity extends BaseEntity {
  @Column({ type: 'bigint', unsigned: true })
  public createdBy: number;

  @Column({ type: 'bigint', unsigned: true })
  public updatedBy: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(3)',
    transformer: new LocalDateTimeTransformer(),
    precision: 3,
  })
  public createdAt: LocalDateTime;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
    transformer: new LocalDateTimeTransformer(),
    precision: 3,
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
