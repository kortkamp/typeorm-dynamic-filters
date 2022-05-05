import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
export interface IOrder {
    orderBy: string | undefined;
    orderType: 'ASC' | 'DESC' | undefined;
}
export default class OrderBuilder<Entity> {
    private readonly queryBuilder;
    private order;
    private alias;
    constructor(queryBuilder: SelectQueryBuilder<Entity>, order: IOrder, alias: string);
    build(): undefined;
}
