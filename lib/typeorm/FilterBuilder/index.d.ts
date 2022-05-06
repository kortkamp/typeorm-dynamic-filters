import { Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { IOrder } from './OrderBuilder';
import { IPage } from './PageBuilder';
import { IFilter } from './WhereBuilder';
export interface IFilterQuery extends IFilter, IPage, IOrder {
}
export declare const test: <Entity>(entityRepository: Repository<Entity>) => SelectQueryBuilder<Entity>;
export declare class FilterBuilder<Entity> {
    entityRepository: Repository<Entity>;
    private alias;
    constructor(entityRepository: Repository<Entity>, alias: string);
    build(query: IFilterQuery): SelectQueryBuilder<Entity>;
}
