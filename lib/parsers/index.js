"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFilter = exports.parseQueryFilters = void 0;
/**
 * Builds our filter dto from the express js query params.
 *
 * See docs
 *
 * @param query - and query param from express js
 * @param options - optional params. Ex '{disablePagination:true}'
 * @returns an object with keys {page, per_page, filterBy, filterType, filterValue, orderBy, orderType}
 */
var parseQueryFilters = function (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
query, options) {
    var default_per_page = (options === null || options === void 0 ? void 0 : options.disablePagination) ? undefined : 10;
    var default_page = (options === null || options === void 0 ? void 0 : options.disablePagination) ? undefined : 1;
    var queryFilterBy = query.filterBy;
    var queryFilterType = query.filterType;
    var queryFilterValue = query.filterValue;
    var filterBy = query.filterBy
        ? queryFilterBy.split(',').map(function (item) { return item.trim(); })
        : [];
    var filterType = query.filterType
        ? queryFilterType.split(',').map(function (item) { return item.trim(); })
        : [];
    var filterValue = query.filterValue
        ? queryFilterValue.split(',').map(function (item) { return item.trim(); })
        : [];
    if (filterBy.length !== filterType.length ||
        filterBy.length !== filterValue.length) {
        throw new Error('Filters must have the same length');
    }
    var page = query.page ? Number(query.page) : default_page;
    var per_page = query.per_page ? Number(query.per_page) : default_per_page;
    return {
        page: page,
        per_page: per_page,
        filterBy: filterBy,
        filterType: filterType,
        filterValue: filterValue,
        orderBy: query.orderBy,
        orderType: query.orderType,
    };
};
exports.parseQueryFilters = parseQueryFilters;
/**
 * Extracts a single filter from our filter query object.
 * The filter will be removed from our filters arrays.
 *
 * See docs
 *
 * @param query - filter object containing {filterBy, filterType, filterValue}
 * @param field - the name of the field to extract
 * @returns an object with keys {filterBy, filterType, filterValue}
 */
var extractFilter = function (_a) {
    var query = _a.query, field = _a.field;
    var filterBy;
    var filterType;
    var filterValue;
    for (var i = 0; i < query.filterBy.length; i += 1) {
        if (query.filterBy[i] === field) {
            filterValue = query.filterValue[i];
            filterBy = query.filterBy[i];
            filterType = query.filterType[i];
            query.filterBy.splice(i, 1);
            query.filterType.splice(i, 1);
            query.filterValue.splice(i, 1);
        }
    }
    var extractedFilter = {
        filterBy: filterBy || undefined,
        filterType: filterType || undefined,
        filterValue: filterValue || undefined,
    };
    return extractedFilter;
};
exports.extractFilter = extractFilter;
