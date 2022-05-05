import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import OrderBuilder, { IOrder } from './OrderBuilder';
import PageBuilder, { IPage } from './PageBuilder';
import WhereBuilder, { IFilter } from './WhereBuilder';

export interface IFilterQuery extends IFilter, IPage, IOrder {}

export default class FilterBuilder<Entity> {
  // private readonly queryBuilder: SelectQueryBuilder<Entity>;

  constructor(
    private entityRepository: Repository<Entity>,

    private alias: string,
  ) {}

  verifyColumnExists(column: string, repo: Repository<Entity>): void {
    const columnExists = repo.metadata.findColumnWithPropertyName(column);
    if (!columnExists) {
      throw new Error(
        `Value ${column} is not valid for field filterBy ou orderBy`,
      );
    }
  }

  build(query: IFilterQuery): SelectQueryBuilder<Entity> {
    const queryBuilder = this.entityRepository.createQueryBuilder(this.alias);
    if (query.orderBy) {
      this.verifyColumnExists(query.orderBy, this.entityRepository);
    }

    query.filterBy.forEach(filterItem =>
      this.verifyColumnExists(filterItem, this.entityRepository),
    );

    const whereBuilder = new WhereBuilder<Entity>(
      queryBuilder,
      query,
      this.alias,
    );
    whereBuilder.build();

    const orderBuilder = new OrderBuilder<Entity>(
      queryBuilder,
      query,
      this.alias,
    );
    orderBuilder.build();

    const pageBuilder = new PageBuilder<Entity>(queryBuilder, query);
    pageBuilder.build();

    return queryBuilder;
  }
}
