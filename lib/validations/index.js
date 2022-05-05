"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWithFilterSchema = void 0;
var Joi = require("joi");
exports.listWithFilterSchema = Joi.object({
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
