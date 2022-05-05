import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { IOrder } from './OrderBuilder';
import { IPage } from './PageBuilder';
import { IFilter } from './WhereBuilder';
export interface IFilterQuery extends IFilter, IPage, IOrder {
}
export declare class FilterBuilder<Entity> {
    private entityRepository;
    private alias;
    constructor(entityRepository: Repository<Entity>, alias: string);
    verifyColumnExists(column: string, repo: Repository<Entity>): void;
    build(query: IFilterQuery): SelectQueryBuilder<Entity>;
}
