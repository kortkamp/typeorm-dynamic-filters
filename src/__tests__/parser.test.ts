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

// describe('Test extractFilter', () => {});
