import {
  createConnection,
  ConnectionOptions,
  getConnectionManager,
} from 'typeorm';

import { User } from './UserEntity';

const options: ConnectionOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [User],
  synchronize: true,
  logging: false,
};

const create = async () => {
  const connection = await createConnection(options);
  return connection;
};

const close = async () => {
  await getConnectionManager().get().close();
};

export { create, close };
