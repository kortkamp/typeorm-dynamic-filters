import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

export interface IOrder {
  orderBy: string | undefined;
  orderType: 'ASC' | 'DESC' | undefined;
}

export const orderBuild = <Entity>(
  queryBuilder: SelectQueryBuilder<Entity>,
  order: IOrder,
  alias: string,
) => {
  if (!order.orderBy) return;

  const orderColumn = `${alias}.${order.orderBy}`;

  queryBuilder.orderBy(orderColumn, order.orderType);
};
