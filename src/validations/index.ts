import Joi = require('joi');

export const listWithFilterSchema = Joi.object({
  page: Joi.number().positive(),
  per_page: Joi.number().positive(),

  filterBy: Joi.string(),
  filterType: Joi.string(),
  filterValue: Joi.string(),

  orderType: Joi.string().valid('ASC', 'DESC'),
  orderBy: Joi.string().when('orderType', {
    is: Joi.exist(),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
}).and('filterBy', 'filterType', 'filterValue');
