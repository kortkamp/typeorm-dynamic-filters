import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
export interface IFilter {
    filterBy: string[];
    filterType: string[];
    filterValue: string[];
}
export interface ISingleFilter {
    filterBy: string;
    filterType: string;
    filterValue: string;
}
export declare const FilterTypes: {
    EQ: string;
    NOT: string;
    IN: string;
    LIKE: string;
    GE: string;
    LE: string;
    BTW: string;
};
export default class WhereBuilder<Entity> {
    private readonly queryBuilder;
    private filter;
    private alias;
    private params;
    private paramsCount;
    constructor(queryBuilder: SelectQueryBuilder<Entity>, filter: IFilter, alias: string);
    build(): undefined;
    private buildFilter;
}
