# Typeorm Dynamic Filters

Create a TypeORM query builder for listing entries with filters, pagination and ordination. 


Compatible with Typeorm 0.3

<br>

## Installation

run:
```bash
npm install typeorm-dynamic-filters
```

or 

```bash
yarn add typeorm-dynamic-filters
```
<br>

## Usage

You will need to import and instantiate the main class 



```
import { getRepository } from 'typeorm';
import { FilterBuilder } from 'typeorm-dynamic-filters';

const myOrmRepository = getRepository<User>(User);

const filterQueryBuilder = new FilterBuilder(myOrmRepository, 'alias');
```
<br>

Then build the queryBuilder for our filters:
```
const queryFilter = {
      filterBy: ['role'],
      filterType: ['not'],
      filterValue: ['admin'],
      page: 1,
      per_page: 12,
      orderBy: 'id',
      orderType: 'ASC',
    };

const queryBuilder = filterQueryBuilder.build(queryFilter);

```

The queryFilter object must be an IFilterQuery object which may be parsed from an ExpressJS request query.

```

import { parseQueryFilters } from 'typeorm-dynamic-filters';

.
.
.

const filter = parseQueryFilters(request.query)

```

Example: 

```
?filterBy=name&filterValue=Maria&filterType=like&page=1&per_page=15&orderBy=id&orderType=ASC

```

will return the object:

```
{
  filterBy: ['name'],
  filterType: ['like'],
  filterValue: ['Maria'],
  page: 1,
  per_page: 15,
  orderBy: 'id',
  orderType: 'ASC',
}

```

You may use multiple filters in your query by splitting the fields by comma ','

```
?filterBy=name,role,active&filterValue=Maria,user,true&filterType=like,eq,eq

{
  filterBy: ['name','role','active'],
  filterType: ['like','eq','eq'],
  filterValue: ['Maria','user','true'],
  page: 1,
  per_page: 15,
  orderBy: 'id',
  orderType: 'ASC',
}

```

The valid filter types are: 

* eq - equal
* not - not equal
* in - included in a array ex: ?filterBy=name&filterType=in&filterValue=Maria|John|Marcelo
* like - sql default like
* ge - greater or equal
* le - lesser or equal
* btw - between two values ex: filterValue=30|40

<br>
The project includes a Joy Schema for validation libs such celebrate:

```
import {listWithFilterSchema} from 'typeorm-dynamic-filters';

```

<br>

## Issues


If you find any bugs in the project please create an [issue](https://github.com/kortkamp/typeorm-dynamic-filters/issues).
<br>


## License

Copyright (c) 2022 Marcelo Kortkamp [kortkamp.dev](https://kortkamp.dev)

[The MIT License](https://github.com/kortkamp/typeorm-dynamic-filters/blob/main/LICENSE)
