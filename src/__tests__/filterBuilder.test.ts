import { Repository } from 'typeorm';

import { FilterBuilder, IFilterQuery } from '../typeorm/FilterBuilder';
import { AppDataSource } from './database/connection';
import { usersData } from './database/seed';
import { User } from './database/UserEntity';

const orderById = (a: User, b: User) => {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
};

describe('Test parseQueryFilters', () => {
  let queryFilter: IFilterQuery;
  let ormRepository: Repository<User>;

  let filterQueryBuilder: FilterBuilder<User>;

  beforeAll(async () => {
    const connection = await AppDataSource.initialize();

    ormRepository = connection.getRepository(User);

    filterQueryBuilder = new FilterBuilder(ormRepository, 'users');

    const createUsers = usersData.map(async user => {
      await ormRepository.save(user);
    });
    await Promise.all(createUsers);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

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

    const filterQueryBuilder = new FilterBuilder(ormRepository, 'users');

    const queryBuilder = filterQueryBuilder.build(queryFilter);

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

    const queryBuilder = filterQueryBuilder.build(queryFilter);

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

    const queryBuilder = filterQueryBuilder.build(queryFilter);

    const totalFirstPage = await queryBuilder.getMany();

    queryFilter.page = 2;

    const secondPageQueryBuilder = filterQueryBuilder.build(queryFilter);

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

    const queryBuilder = filterQueryBuilder.build(queryFilter);

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

    const queryBuilder = filterQueryBuilder.build(queryFilter);

    const filteredUsers = await queryBuilder.getMany();

    const filteredUsersData = usersData.filter(
      user => user.role && user.role !== 'admin',
    );

    expect(filteredUsers.sort(orderById)).toEqual(
      filteredUsersData.sort(orderById),
    );
  });

  it('Should return IN filtered itens', async () => {
    queryFilter = {
      filterBy: ['name'],
      filterType: ['in'],
      filterValue: ['John|Peter|Maria'],
      page: undefined,
      per_page: undefined,
      orderBy: undefined,
      orderType: undefined,
    };

    const queryBuilder = filterQueryBuilder.build(queryFilter);

    const filteredUsers = await queryBuilder.getMany();

    const filteredUsersData = usersData.filter(user =>
      ['John', 'Peter', 'Maria'].includes(user.name),
    );

    expect(filteredUsers.sort(orderById)).toEqual(
      filteredUsersData.sort(orderById),
    );
  });

  it('Should return LIKE filtered itens', async () => {
    queryFilter = {
      filterBy: ['name'],
      filterType: ['like'],
      filterValue: ['Mar'],
      page: undefined,
      per_page: undefined,
      orderBy: undefined,
      orderType: undefined,
    };

    const queryBuilder = filterQueryBuilder.build(queryFilter);

    const filteredUsers = await queryBuilder.getMany();

    const filteredUsersData = usersData.filter(user =>
      user.name.includes('Mar'),
    );

    expect(filteredUsers.sort(orderById)).toEqual(
      filteredUsersData.sort(orderById),
    );
  });

  it('Should return GE filtered itens', async () => {
    queryFilter = {
      filterBy: ['id'],
      filterType: ['ge'],
      filterValue: ['4'],
      page: undefined,
      per_page: undefined,
      orderBy: undefined,
      orderType: undefined,
    };

    const queryBuilder = filterQueryBuilder.build(queryFilter);

    const filteredUsers = await queryBuilder.getMany();

    const filteredUsersData = usersData.filter(user => user.id >= '4');

    expect(filteredUsers.sort(orderById)).toEqual(
      filteredUsersData.sort(orderById),
    );
  });

  it('Should return LE filtered itens', async () => {
    queryFilter = {
      filterBy: ['id'],
      filterType: ['le'],
      filterValue: ['4'],
      page: undefined,
      per_page: undefined,
      orderBy: undefined,
      orderType: undefined,
    };

    const queryBuilder = filterQueryBuilder.build(queryFilter);

    const filteredUsers = await queryBuilder.getMany();

    const filteredUsersData = usersData.filter(user => user.id <= '4');

    expect(filteredUsers.sort(orderById)).toEqual(
      filteredUsersData.sort(orderById),
    );
  });

  it('Should return BTW filtered itens', async () => {
    queryFilter = {
      filterBy: ['id'],
      filterType: ['btw'],
      filterValue: ['4|9'],
      page: undefined,
      per_page: undefined,
      orderBy: undefined,
      orderType: undefined,
    };

    const queryBuilder = filterQueryBuilder.build(queryFilter);

    const filteredUsers = await queryBuilder.getMany();

    const filteredUsersData = usersData.filter(
      user => user.id >= '4' && user.id <= '9',
    );

    expect(filteredUsers.sort(orderById)).toEqual(
      filteredUsersData.sort(orderById),
    );
  });

  it('Should return multiple fields filtered itens', async () => {
    queryFilter = {
      filterBy: ['id', 'name', 'sex'],
      filterType: ['btw', 'like', 'eq'],
      filterValue: ['4|9', 'Mar', 'male'],
      page: undefined,
      per_page: undefined,
      orderBy: undefined,
      orderType: undefined,
    };

    const queryBuilder = filterQueryBuilder.build(queryFilter);

    const filteredUsers = await queryBuilder.getMany();

    expect(filteredUsers).toEqual([usersData[3]]);
  });

  it('Should return EQ "null" filtered itens', async () => {
    queryFilter = {
      filterBy: ['role'],
      filterType: ['eq'],
      filterValue: ['null'],
      page: undefined,
      per_page: undefined,
      orderBy: undefined,
      orderType: undefined,
    };

    const queryBuilder = filterQueryBuilder.build(queryFilter);

    const filteredUsers = await queryBuilder.getMany();

    const filteredUsersData = usersData.filter(user => !user.role);

    expect(filteredUsers.length).toBe(filteredUsersData.length);
  });
});
