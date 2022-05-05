import { IFilterQuery } from '../typeorm/FilterBuilder';
interface IParserOptions {
    disablePagination: boolean;
}
/**
 * Builds our filter dto from the express js query params.
 *
 * See docs
 *
 * @param query - and query param from express js
 * @param options - optional params. Ex '{disablePagination:true}'
 * @returns an object with keys {page, per_page, filterBy, filterType, filterValue, orderBy, orderType}
 */
export declare const parseQueryFilters: (query: any, options?: IParserOptions | undefined) => IFilterQuery;
interface IExtractFilterParams {
    query: IFilterQuery;
    field: string;
}
interface IExtractFilterResponse {
    filterBy: string | undefined;
    filterType: string | undefined;
    filterValue: string | undefined;
}
/**
 * Extracts a single filter from our filter query object.
 * The filter will be removed from our filters arrays.
 *
 * See docs
 *
 * @param query - filter object containing {filterBy, filterType, filterValue}
 * @param field - the name of the field to extract
 * @returns an object with keys {filterBy, filterType, filterValue}
 */
export declare const extractFilter: ({ query, field, }: IExtractFilterParams) => IExtractFilterResponse | Record<string, never>;
export {};
