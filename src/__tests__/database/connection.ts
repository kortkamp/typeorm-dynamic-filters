import { DataSource, DataSourceOptions } from 'typeorm';

import { User } from './UserEntity';

const options: DataSourceOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [User],
  synchronize: true,
  logging: false,
};

export const AppDataSource = new DataSource(options);
