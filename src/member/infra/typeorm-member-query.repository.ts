import { Injectable } from '@nestjs/common';
import { MemberQueryRepository } from '../domain/repository/member-query.repository';
import { MemberCondition } from '../../global/common/domain/repository/dto/member.condition';
import { getMetadataArgsStorage, Repository, SelectQueryBuilder } from 'typeorm';
import { Member } from '../domain/entity/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberResponse } from '../interface/dto/response/member.response';
import { plainToInstance } from 'class-transformer';
import { PagingResponse } from '../../global/common/interface/dto/response/paging.response';
import { SortEnum } from '../../global/common/domain/enum/sort.enum';
import { BadRequestException } from '../../global/exception/bad-request.exception';

@Injectable()
export class TypeormMemberQueryRepository implements MemberQueryRepository {
  public static readonly ENTITY_FIELD_NAMES = getMetadataArgsStorage()
    .columns.filter(column => column.target === Member)
    .map(column => column.propertyName);

  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async find(condition: MemberCondition): Promise<MemberResponse | null> {
    const queryBuilder = this.memberRepository
      .createQueryBuilder('member')
      .select(['member.id as _id', 'member.email as _email', 'member.password as _password', 'member.role as _role']);

    this.eqId(queryBuilder, condition.id);
    this.eqEmail(queryBuilder, condition.email);
    this.eqRole(queryBuilder, condition.role);

    const result = (await queryBuilder.getRawOne()) as unknown;
    return plainToInstance(MemberResponse, result);
  }

  async findAll(condition: MemberCondition): Promise<MemberResponse[] | PagingResponse<MemberResponse> | []> {
    const queryBuilder = this.memberRepository
      .createQueryBuilder('member')
      .select(['member.id as _id', 'member.email as _email', 'member.password as _password', 'member.role as _role']);

    this.eqId(queryBuilder, condition.id);
    this.eqEmail(queryBuilder, condition.email);
    this.eqRole(queryBuilder, condition.role);

    const idSort = this.setOrderBy(condition, queryBuilder);

    if (condition.lastId && condition.size && idSort) {
      return await this.getInfiniteScrollResult(idSort, queryBuilder, condition);
    }

    if (condition.page && condition.size) {
      return await this.getPagingResult(queryBuilder, condition);
    }

    const results = await queryBuilder.getRawMany();
    return results.map(result => plainToInstance(MemberResponse, result) as unknown as MemberResponse);
  }

  private eqId(queryBuilder: SelectQueryBuilder<Member>, id?: number | null): void {
    if (!id) {
      return;
    }

    queryBuilder.andWhere('member.id = :id', { id });
  }

  private eqEmail(queryBuilder: SelectQueryBuilder<Member>, email?: string | null): void {
    if (!email) {
      return;
    }

    queryBuilder.andWhere('member.email = :email', { email });
  }

  private eqRole(queryBuilder: SelectQueryBuilder<Member>, role?: string | null): void {
    if (!role) {
      return;
    }

    queryBuilder.andWhere('member.role = :role', { role });
  }

  private setOrderBy(condition: MemberCondition, queryBuilder: SelectQueryBuilder<Member>): SortEnum | null {
    let idSort: SortEnum | null = null;

    condition.sort.forEach(sort => {
      const { field, orderBy } = sort;

      if (!TypeormMemberQueryRepository.ENTITY_FIELD_NAMES.includes(field)) {
        throw new BadRequestException(BadRequestException.ErrorCodes.INVALID_SORT_OPTION, {
          field: field,
          orderBy: orderBy.code,
        });
      }

      queryBuilder.addOrderBy(`member.${field}`, orderBy.code as 'ASC' | 'DESC');

      if (field === 'id') {
        idSort = orderBy;
      }
    });

    return idSort;
  }

  private async getInfiniteScrollResult(
    idSort: SortEnum,
    queryBuilder: SelectQueryBuilder<Member>,
    condition: MemberCondition,
  ) {
    const operator = idSort === SortEnum.ASC ? '>' : '<';

    const totalCount = await queryBuilder.getCount();

    queryBuilder.andWhere(`member.id ${operator} :lastId`, { lastId: condition.lastId });
    queryBuilder.limit(condition.getLimit());

    const results = await queryBuilder.getRawMany();

    return new PagingResponse<MemberResponse>(
      null,
      condition.size as number,
      totalCount,
      results.length,
      results.map(result => plainToInstance(MemberResponse, result) as unknown as MemberResponse),
    );
  }

  private async getPagingResult(queryBuilder: SelectQueryBuilder<Member>, condition: MemberCondition) {
    const totalCount = await queryBuilder.getCount();

    queryBuilder.offset(condition.getOffset());
    queryBuilder.limit(condition.getLimit());

    const results = await queryBuilder.getRawMany();

    return new PagingResponse<MemberResponse>(
      condition.page as number,
      condition.size as number,
      totalCount,
      results.length,
      results.map(result => plainToInstance(MemberResponse, result) as unknown as MemberResponse),
    );
  }
}
