import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

export interface IPage {
  page: number | undefined;
  per_page: number | undefined;
}

export default class PageBuilder<Entity> {
  constructor(
    private readonly queryBuilder: SelectQueryBuilder<Entity>,
    private pagination?: IPage,
  ) {}

  build(): void {
    if (!this.pagination?.per_page) {
      return;
    }

    const page = this.pagination.page
      ? (this.pagination.page - 1) * this.pagination.per_page
      : undefined;

    this.queryBuilder.take(this.pagination.per_page);
    this.queryBuilder.skip(page);
  }
}
