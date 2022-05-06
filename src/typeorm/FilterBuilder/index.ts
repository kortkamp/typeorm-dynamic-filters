import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import { orderBuild, IOrder } from './OrderBuilder';
import { pageBuild, IPage } from './PageBuilder';
import { whereBuild, IFilter } from './WhereBuilder';

export interface IFilterQuery extends IFilter, IPage, IOrder {}

export const test = <Entity>(entityRepository: Repository<Entity>) => {
  return entityRepository.createQueryBuilder();
};

export class FilterBuilder<Entity> {
  constructor(
    public entityRepository: Repository<Entity>,

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

    whereBuild(queryBuilder, query, this.alias);

    orderBuild(queryBuilder, query, this.alias);

    pageBuild(queryBuilder, query);

    return queryBuilder;
  }
}
