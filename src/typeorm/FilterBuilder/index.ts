import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import OrderBuilder, { IOrder } from './OrderBuilder';
import PageBuilder, { IPage } from './PageBuilder';
import WhereBuilder, { IFilter } from './WhereBuilder';

export interface IFilterQuery extends IFilter, IPage, IOrder {}

export default class FilterBuilder<Entity> {
  private readonly queryBuilder: SelectQueryBuilder<Entity>;

  constructor(
    entityRepository: Repository<Entity>,
    private query: IFilterQuery,
    private alias: string,
  ) {
    this.queryBuilder = entityRepository.createQueryBuilder(alias);

    if (query.orderBy) {
      this.verifyColumnExists(query.orderBy, entityRepository);
    }

    query.filterBy.forEach(filterItem =>
      this.verifyColumnExists(filterItem, entityRepository),
    );
  }

  verifyColumnExists(column: string, repo: Repository<Entity>): void {
    const columnExists = repo.metadata.findColumnWithPropertyName(column);
    if (!columnExists) {
      throw new Error(
        `Value ${column} is not valid for field filterBy ou orderBy`,
      );
    }
  }

  build(): SelectQueryBuilder<Entity> {
    const whereBuilder = new WhereBuilder<Entity>(
      this.queryBuilder,
      this.query,
      this.alias,
    );
    whereBuilder.build();

    const orderBuilder = new OrderBuilder<Entity>(
      this.queryBuilder,
      this.query,
      this.alias,
    );
    orderBuilder.build();

    const pageBuilder = new PageBuilder<Entity>(this.queryBuilder, this.query);
    pageBuilder.build();

    return this.queryBuilder;
  }
}
