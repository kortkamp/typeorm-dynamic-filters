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

export default class WhereBuilder<Entity> {
  private params: Record<string, ParamValue> = {};
  private paramsCount = 0;

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<Entity>,
    private filter: IFilter,
    private alias: string,
  ) {}

  build(): undefined {
    const filterLength = this.filter.filterBy?.length;

    if (!filterLength) return;

    for (let i = 0; i < filterLength; i += 1) {
      this.queryBuilder.andWhere(
        this.buildFilter(
          {
            filterBy: this.filter.filterBy[i],
            filterType: this.filter.filterType[i],
            filterValue: this.filter.filterValue[i],
          },
          this.alias,
        ),
        this.params,
      );
    }
  }

  private buildFilter(filter: ISingleFilter, alias: string): string {
    const whereColumn = `${alias}.${filter.filterBy}`;

    this.paramsCount += 1;
    const paramName = `${filter.filterBy}_${this.paramsCount}`;
    const paramAuxName = `${filter.filterBy}_${this.paramsCount}_aux`;

    switch (filter.filterType) {
      case FilterTypes.EQ:
        this.params[paramName] = filter.filterValue;
        return `${whereColumn} = :${paramName}`;

      case FilterTypes.NOT:
        this.params[paramName] = filter.filterValue;
        return `${whereColumn} != :${paramName}`;

      case FilterTypes.IN:
        this.params[paramName] = filter.filterValue.split('|');
        return filter.filterValue.length
          ? `${whereColumn} IN (:...${paramName})`
          : `${whereColumn} IN (null)`;

      case FilterTypes.LIKE:
        this.params[paramName] = `%${filter.filterValue}%`;
        return `CAST(${whereColumn} AS TEXT)  LIKE :${paramName}`;

      case FilterTypes.GE:
        this.params[paramName] = filter.filterValue;
        return `${whereColumn} >= :${paramName}`;

      case FilterTypes.LE:
        this.params[paramName] = filter.filterValue;
        return `${whereColumn} <= :${paramName}`;

      case FilterTypes.BTW:
        [this.params[paramName], this.params[paramAuxName]] =
          filter.filterValue.split('|');

        return `${whereColumn} BETWEEN :${paramName} AND :${paramAuxName} `;

      default:
        throw new Error(`Unknown filter type: ${filter.filterType}!`);
    }
  }
}
