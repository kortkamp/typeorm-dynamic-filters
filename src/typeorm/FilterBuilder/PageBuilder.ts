import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

export interface IPage {
  page: number | undefined;
  per_page: number | undefined;
}

export const pageBuild = <Entity>(
  queryBuilder: SelectQueryBuilder<Entity>,
  pagination?: IPage,
) => {
  if (!pagination?.per_page) {
    return;
  }

  const page = pagination.page
    ? (pagination.page - 1) * pagination.per_page
    : undefined;

  queryBuilder.take(pagination.per_page);
  queryBuilder.skip(page);
};
