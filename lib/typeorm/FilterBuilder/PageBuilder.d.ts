import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
export interface IPage {
    page: number | undefined;
    per_page: number | undefined;
}
export default class PageBuilder<Entity> {
    private readonly queryBuilder;
    private pagination?;
    constructor(queryBuilder: SelectQueryBuilder<Entity>, pagination?: IPage | undefined);
    build(): void;
}
