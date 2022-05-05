"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterTypes = void 0;
exports.FilterTypes = {
    EQ: 'eq',
    NOT: 'not',
    IN: 'in',
    LIKE: 'like',
    GE: 'ge',
    LE: 'le',
    BTW: 'btw',
};
var WhereBuilder = /** @class */ (function () {
    function WhereBuilder(queryBuilder, filter, alias) {
        this.queryBuilder = queryBuilder;
        this.filter = filter;
        this.alias = alias;
        this.params = {};
        this.paramsCount = 0;
    }
    WhereBuilder.prototype.build = function () {
        var _a;
        var filterLength = (_a = this.filter.filterBy) === null || _a === void 0 ? void 0 : _a.length;
        if (!filterLength)
            return;
        for (var i = 0; i < filterLength; i += 1) {
            this.queryBuilder.andWhere(this.buildFilter({
                filterBy: this.filter.filterBy[i],
                filterType: this.filter.filterType[i],
                filterValue: this.filter.filterValue[i],
            }, this.alias), this.params);
        }
    };
    WhereBuilder.prototype.buildFilter = function (filter, alias) {
        var _a;
        var whereColumn = "".concat(alias, ".").concat(filter.filterBy);
        this.paramsCount += 1;
        var paramName = "".concat(filter.filterBy, "_").concat(this.paramsCount);
        var paramAuxName = "".concat(filter.filterBy, "_").concat(this.paramsCount, "_aux");
        switch (filter.filterType) {
            case exports.FilterTypes.EQ:
                this.params[paramName] = filter.filterValue;
                return "".concat(whereColumn, " = :").concat(paramName);
            case exports.FilterTypes.NOT:
                this.params[paramName] = filter.filterValue;
                return "".concat(whereColumn, " != :").concat(paramName);
            case exports.FilterTypes.IN:
                this.params[paramName] = filter.filterValue.split('|');
                return filter.filterValue.length
                    ? "".concat(whereColumn, " IN (:...").concat(paramName, ")")
                    : "".concat(whereColumn, " IN (null)");
            case exports.FilterTypes.LIKE:
                this.params[paramName] = "%".concat(filter.filterValue, "%");
                return "CAST(".concat(whereColumn, " AS TEXT)  LIKE :").concat(paramName);
            case exports.FilterTypes.GE:
                this.params[paramName] = filter.filterValue;
                return "".concat(whereColumn, " >= :").concat(paramName);
            case exports.FilterTypes.LE:
                this.params[paramName] = filter.filterValue;
                return "".concat(whereColumn, " <= :").concat(paramName);
            case exports.FilterTypes.BTW:
                _a = filter.filterValue.split('|'), this.params[paramName] = _a[0], this.params[paramAuxName] = _a[1];
                return "".concat(whereColumn, " BETWEEN :").concat(paramName, " AND :").concat(paramAuxName, " ");
            default:
                throw new Error("Unknown filter type: ".concat(filter.filterType, "!"));
        }
    };
    return WhereBuilder;
}());
exports.default = WhereBuilder;
