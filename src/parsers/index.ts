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
export const parseQueryFilters = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  options?: IParserOptions,
): IFilterQuery => {
  const default_per_page = options?.disablePagination ? undefined : 10;
  const default_page = options?.disablePagination ? undefined : 1;

  const queryFilterBy: string = query.filterBy;
  const queryFilterType: string = query.filterType;
  const queryFilterValue: string = query.filterValue;

  const filterBy = query.filterBy
    ? queryFilterBy.split(',').map(item => item.trim())
    : [];

  const filterType = query.filterType
    ? queryFilterType.split(',').map(item => item.trim())
    : [];

  const filterValue = query.filterValue
    ? queryFilterValue.split(',').map(item => item.trim())
    : [];

  if (
    filterBy.length !== filterType.length ||
    filterBy.length !== filterValue.length
  ) {
    throw new Error('Filters must have the same length');
  }

  const page = query.page ? Number(query.page) : default_page;
  const per_page = query.per_page ? Number(query.per_page) : default_per_page;

  return {
    page,
    per_page,

    filterBy,
    filterType,
    filterValue,

    orderBy: query.orderBy as string | undefined,
    orderType: query.orderType as 'ASC' | 'DESC' | undefined,
  };
};

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
export const extractFilter = ({
  query,
  field,
}: IExtractFilterParams): IExtractFilterResponse | Record<string, never> => {
  let filterBy: string | undefined;
  let filterType: string | undefined;
  let filterValue: string | undefined;
  for (let i = 0; i < query.filterBy.length; i += 1) {
    if (query.filterBy[i] === field) {
      filterValue = query.filterValue[i];
      filterBy = query.filterBy[i];
      filterType = query.filterType[i];
      query.filterBy.splice(i, 1);
      query.filterType.splice(i, 1);
      query.filterValue.splice(i, 1);
    }
  }

  const extractedFilter = {
    filterBy: filterBy || undefined,
    filterType: filterType || undefined,
    filterValue: filterValue || undefined,
  };
  return extractedFilter;
};
