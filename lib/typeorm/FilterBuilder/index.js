"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterBuilder = exports.test = void 0;
var OrderBuilder_1 = require("./OrderBuilder");
var PageBuilder_1 = require("./PageBuilder");
var WhereBuilder_1 = require("./WhereBuilder");
var test = function (entityRepository) {
    return entityRepository.createQueryBuilder();
};
exports.test = test;
var FilterBuilder = /** @class */ (function () {
    function FilterBuilder(entityRepository, alias) {
        this.entityRepository = entityRepository;
        this.alias = alias;
    }
    FilterBuilder.prototype.verifyColumnExists = function (column, repo) {
        var columnExists = repo.metadata.findColumnWithPropertyName(column);
        if (!columnExists) {
            throw new Error("Value ".concat(column, " is not valid for field filterBy ou orderBy"));
        }
    };
    FilterBuilder.prototype.build = function (query) {
        var _this = this;
        var queryBuilder = this.entityRepository.createQueryBuilder(this.alias);
        if (query.orderBy) {
            this.verifyColumnExists(query.orderBy, this.entityRepository);
        }
        query.filterBy.forEach(function (filterItem) {
            return _this.verifyColumnExists(filterItem, _this.entityRepository);
        });
        (0, WhereBuilder_1.whereBuild)(queryBuilder, query, this.alias);
        (0, OrderBuilder_1.orderBuild)(queryBuilder, query, this.alias);
        (0, PageBuilder_1.pageBuild)(queryBuilder, query);
        return queryBuilder;
    };
    return FilterBuilder;
}());
exports.FilterBuilder = FilterBuilder;
