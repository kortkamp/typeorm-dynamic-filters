import { Repository } from 'typeorm';

import FilterBuilder, { IFilterQuery } from '../typeorm/FilterBuilder';
import { AppDataSource } from './database/connection';
import { usersData } from './database/seed';
import { User } from './database/UserEntity';

// EQ: 'eq',
// NOT: 'not',
// IN: 'in',
// LIKE: 'like',
// GE: 'ge',
// LE: 'le',
// BTW: 'btw',

describe('Test parseQueryFilters', () => {
  let queryFilter: IFilterQuery;
  let ormRepository: Repository<User>;
  beforeAll(async () => {
    await AppDataSource.initialize();

    ormRepository = AppDataSource.getRepository(User);

    const createUsers = usersData.map(async user => {
      await ormRepository.save(user);
    });
    await Promise.all(createUsers);
  });

  // afterAll(() => {
  // });

  it('Should return all unfiltered itens', async () => {
    queryFilter = {
      filterBy: [],
      filterType: [],
      filterValue: [],
      page: undefined,
      per_page: undefined,
      orderBy: undefined,
      orderType: undefined,
    };

    const filterQueryBuilder = new FilterBuilder(
      ormRepository,
      queryFilter,
      'users',
    );

    const queryBuilder = filterQueryBuilder.build();

    const [_, total] = await queryBuilder.getManyAndCount();
    expect(total).toBe(usersData.length);
  });

  it('Should return all itens ordered', async () => {
    queryFilter = {
      filterBy: [],
      filterType: [],
      filterValue: [],
      page: undefined,
      per_page: undefined,
      orderBy: 'id',
      orderType: 'ASC',
    };

    const filterQueryBuilder = new FilterBuilder(
      ormRepository,
      queryFilter,
      'users',
    );
    const queryBuilder = filterQueryBuilder.build();

    const [result, _] = await queryBuilder.getManyAndCount();

    const isAscending = result.every((user, index) => {
      return index === 0 || user.id >= result[index - 1].id;
    });

    expect(isAscending).toBe(true);
  });

  it('Should return all paginated', async () => {
    const per_page = 7;

    queryFilter = {
      filterBy: [],
      filterType: [],
      filterValue: [],
      page: 1,
      per_page,
      orderBy: undefined,
      orderType: undefined,
    };

    const filterQueryBuilder = new FilterBuilder(
      ormRepository,
      queryFilter,
      'users',
    );
    const queryBuilder = filterQueryBuilder.build();
    const totalFirstPage = await queryBuilder.getMany();

    queryFilter.page = 2;

    const secondPageFilterQueryBuilder = new FilterBuilder(
      ormRepository,
      queryFilter,
      'users',
    );
    const secondPageQueryBuilder = secondPageFilterQueryBuilder.build();

    const totalSecondPage = await secondPageQueryBuilder.getMany();

    expect(totalFirstPage.length + totalSecondPage.length).toBe(
      usersData.length,
    );
  });

  it('Should return EQ filtered itens', async () => {
    queryFilter = {
      filterBy: ['role'],
      filterType: ['eq'],
      filterValue: ['admin'],
      page: undefined,
      per_page: undefined,
      orderBy: undefined,
      orderType: undefined,
    };

    const filterQueryBuilder = new FilterBuilder(
      ormRepository,
      queryFilter,
      'users',
    );
    const queryBuilder = filterQueryBuilder.build();

    const filteredUsers = await queryBuilder.getMany();

    const filteredUsersData = usersData.filter(user => user.role === 'admin');

    expect(filteredUsers.length).toBe(filteredUsersData.length);
  });

  it('Should return NOT filtered itens', async () => {
    queryFilter = {
      filterBy: ['role'],
      filterType: ['not'],
      filterValue: ['admin'],
      page: undefined,
      per_page: undefined,
      orderBy: undefined,
      orderType: undefined,
    };

    const filterQueryBuilder = new FilterBuilder(
      ormRepository,
      queryFilter,
      'users',
    );
    const queryBuilder = filterQueryBuilder.build();

    const filteredUsers = await queryBuilder.getMany();

    const filteredUsersData = usersData.filter(user => user.role !== 'admin');

    expect(filteredUsers.length).toBe(filteredUsersData.length);
  });
});
