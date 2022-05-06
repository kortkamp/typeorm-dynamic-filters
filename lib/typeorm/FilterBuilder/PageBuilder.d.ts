import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
export interface IPage {
    page: number | undefined;
    per_page: number | undefined;
}
export declare const pageBuild: <Entity>(queryBuilder: SelectQueryBuilder<Entity>, pagination?: IPage | undefined) => void;
