import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
export interface IOrder {
    orderBy: string | undefined;
    orderType: 'ASC' | 'DESC' | undefined;
}
export declare const orderBuild: <Entity>(queryBuilder: SelectQueryBuilder<Entity>, order: IOrder, alias: string) => void;
