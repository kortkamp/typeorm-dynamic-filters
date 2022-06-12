"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whereBuild = exports.FilterTypes = void 0;
exports.FilterTypes = {
    EQ: 'eq',
    NOT: 'not',
    IN: 'in',
    LIKE: 'like',
    GE: 'ge',
    LE: 'le',
    BTW: 'btw',
};
var buildFilter = function (filter, alias, params, paramsCount) {
    var _a;
    if (params === void 0) { params = {}; }
    if (paramsCount === void 0) { paramsCount = 0; }
    var whereColumn = "".concat(alias, ".").concat(filter.filterBy);
    paramsCount += 1;
    var paramName = "".concat(filter.filterBy, "_").concat(paramsCount);
    var paramAuxName = "".concat(filter.filterBy, "_").concat(paramsCount, "_aux");
    switch (filter.filterType) {
        case exports.FilterTypes.EQ:
            params[paramName] = filter.filterValue;
            if (filter.filterValue === 'null') {
                return "".concat(whereColumn, " IS NULL");
            }
            return "".concat(whereColumn, " = :").concat(paramName);
        case exports.FilterTypes.NOT:
            params[paramName] = filter.filterValue;
            return "".concat(whereColumn, " != :").concat(paramName);
        case exports.FilterTypes.IN:
            params[paramName] = filter.filterValue.split('|');
            return filter.filterValue.length
                ? "".concat(whereColumn, " IN (:...").concat(paramName, ")")
                : "".concat(whereColumn, " IN (null)");
        case exports.FilterTypes.LIKE:
            params[paramName] = "%".concat(filter.filterValue, "%");
            return "CAST(".concat(whereColumn, " AS TEXT)  LIKE :").concat(paramName);
        case exports.FilterTypes.GE:
            params[paramName] = filter.filterValue;
            return "".concat(whereColumn, " >= :").concat(paramName);
        case exports.FilterTypes.LE:
            params[paramName] = filter.filterValue;
            return "".concat(whereColumn, " <= :").concat(paramName);
        case exports.FilterTypes.BTW:
            _a = filter.filterValue.split('|'), params[paramName] = _a[0], params[paramAuxName] = _a[1];
            return "".concat(whereColumn, " BETWEEN :").concat(paramName, " AND :").concat(paramAuxName, " ");
        default:
            throw new Error("Unknown filter type: ".concat(filter.filterType, "!"));
    }
};
var whereBuild = function (queryBuilder, filter, alias) {
    var _a;
    var params = {};
    var paramsCount = 0;
    var filterLength = (_a = filter.filterBy) === null || _a === void 0 ? void 0 : _a.length;
    if (!filterLength)
        return;
    for (var i = 0; i < filterLength; i += 1) {
        queryBuilder.andWhere(buildFilter({
            filterBy: filter.filterBy[i],
            filterType: filter.filterType[i],
            filterValue: filter.filterValue[i],
        }, alias, params, paramsCount), params);
    }
};
exports.whereBuild = whereBuild;
