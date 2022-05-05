import { parseQueryFilters, extractFilter } from '../parsers';
import { IFilterQuery } from '../typeorm/FilterBuilder';

describe('Test parseQueryFilters', () => {
  let query: Record<string, unknown>;
  let parsedQueryObject: IFilterQuery;
  beforeEach(() => {
    query = {
      filterBy: 'name,active',
      filterType: 'EQ,EQ',
      filterValue: 'John Doe,true',
      page: 1,
      per_page: 10,
      orderBy: 'created_at',
      orderType: 'DESC',
    };

    parsedQueryObject = {
      filterBy: ['name', 'active'],
      filterType: ['EQ', 'EQ'],
      filterValue: ['John Doe', 'true'],
      page: 1,
      per_page: 10,
      orderBy: 'created_at',
      orderType: 'DESC',
    };
  });

  it('Should build the goal parsed object', () => {
    expect(parseQueryFilters(query)).toEqual(parsedQueryObject);
  });

  it('Should use default page:1 per_page:10 when not provided', () => {
    query = {
      filterBy: 'name,active',
      filterType: 'EQ,EQ',
      filterValue: 'John Doe,true',
      orderBy: 'created_at',
      orderType: 'DESC',
    };
    expect(parseQueryFilters(query)).toEqual(parsedQueryObject);
  });

  it('Should return empty arrays for filter keys when not provided', () => {
    query = {
      orderBy: 'created_at',
      orderType: 'DESC',
    };

    parsedQueryObject = {
      filterBy: [],
      filterType: [],
      filterValue: [],
      page: 1,
      per_page: 10,
      orderBy: 'created_at',
      orderType: 'DESC',
    };

    expect(parseQueryFilters(query)).toEqual(parsedQueryObject);
  });

  it('Should throws an error when parsing not matching filters quantity', () => {
    query = {
      // 2 params
      filterBy: 'name,active',
      // only 1 param
      filterType: 'EQ',
      filterValue: 'John Doe,true',
      page: 1,
      per_page: 10,
      orderBy: 'created_at',
      orderType: 'DESC',
    };

    expect(() => {
      parseQueryFilters(query);
    }).toThrow();
  });
});

describe('Test extractFilter', () => {
  let filterQueryObject: IFilterQuery;

  beforeEach(() => {
    filterQueryObject = {
      filterBy: ['name', 'active', 'sales', 'issues'],
      filterType: ['EQ', 'EQ', 'GE', 'LE'],
      filterValue: ['John Doe', 'true', '100', '4'],
      page: 1,
      per_page: 10,
      orderBy: 'created_at',
      orderType: 'DESC',
    };
  });

  it('Should extract the desired filter from query filters', () => {
    const filter = extractFilter({ query: filterQueryObject, field: 'issues' });

    expect(filter).toEqual({
      filterBy: 'issues',
      filterType: 'LE',
      filterValue: '4',
    });

    expect(filterQueryObject).toEqual({
      filterBy: ['name', 'active', 'sales'],
      filterType: ['EQ', 'EQ', 'GE'],
      filterValue: ['John Doe', 'true', '100'],
      page: 1,
      per_page: 10,
      orderBy: 'created_at',
      orderType: 'DESC',
    });
  });

  it('Should remove the filter from the query param', () => {
    extractFilter({ query: filterQueryObject, field: 'active' });

    expect(filterQueryObject).toEqual({
      filterBy: ['name', 'sales', 'issues'],
      filterType: ['EQ', 'GE', 'LE'],
      filterValue: ['John Doe', '100', '4'],
      page: 1,
      per_page: 10,
      orderBy: 'created_at',
      orderType: 'DESC',
    });
  });

  it('Should return undefined params for a nonexistent filter', () => {
    const filter = extractFilter({ query: filterQueryObject, field: 'role' });

    expect(filter).toEqual({
      filterBy: undefined,
      filterType: undefined,
      filterValue: undefined,
    });
  });
});
