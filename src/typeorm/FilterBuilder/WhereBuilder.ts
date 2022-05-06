/* eslint-disable no-param-reassign */
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

type ParamValue = string | number | Array<string | number>;

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

export const FilterTypes = {
  EQ: 'eq',
  NOT: 'not',
  IN: 'in',
  LIKE: 'like',
  GE: 'ge',
  LE: 'le',
  BTW: 'btw',
};

const buildFilter = (
  filter: ISingleFilter,
  alias: string,
  params: Record<string, ParamValue> = {},
  paramsCount = 0,
): string => {
  const whereColumn = `${alias}.${filter.filterBy}`;

  paramsCount += 1;
  const paramName = `${filter.filterBy}_${paramsCount}`;
  const paramAuxName = `${filter.filterBy}_${paramsCount}_aux`;

  switch (filter.filterType) {
    case FilterTypes.EQ:
      params[paramName] = filter.filterValue;
      return `${whereColumn} = :${paramName}`;

    case FilterTypes.NOT:
      params[paramName] = filter.filterValue;
      return `${whereColumn} != :${paramName}`;

    case FilterTypes.IN:
      params[paramName] = filter.filterValue.split('|');
      return filter.filterValue.length
        ? `${whereColumn} IN (:...${paramName})`
        : `${whereColumn} IN (null)`;

    case FilterTypes.LIKE:
      params[paramName] = `%${filter.filterValue}%`;
      return `CAST(${whereColumn} AS TEXT)  LIKE :${paramName}`;

    case FilterTypes.GE:
      params[paramName] = filter.filterValue;
      return `${whereColumn} >= :${paramName}`;

    case FilterTypes.LE:
      params[paramName] = filter.filterValue;
      return `${whereColumn} <= :${paramName}`;

    case FilterTypes.BTW:
      [params[paramName], params[paramAuxName]] = filter.filterValue.split('|');

      return `${whereColumn} BETWEEN :${paramName} AND :${paramAuxName} `;

    default:
      throw new Error(`Unknown filter type: ${filter.filterType}!`);
  }
};

export const whereBuild = <Entity>(
  queryBuilder: SelectQueryBuilder<Entity>,
  filter: IFilter,
  alias: string,
): undefined => {
  const params: Record<string, ParamValue> = {};
  const paramsCount = 0;
  const filterLength = filter.filterBy?.length;

  if (!filterLength) return;

  for (let i = 0; i < filterLength; i += 1) {
    queryBuilder.andWhere(
      buildFilter(
        {
          filterBy: filter.filterBy[i],
          filterType: filter.filterType[i],
          filterValue: filter.filterValue[i],
        },
        alias,
        params,
        paramsCount,
      ),
      params,
    );
  }
};
