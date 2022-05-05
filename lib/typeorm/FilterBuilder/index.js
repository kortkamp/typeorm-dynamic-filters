"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var OrderBuilder_1 = __importDefault(require("./OrderBuilder"));
var PageBuilder_1 = __importDefault(require("./PageBuilder"));
var WhereBuilder_1 = __importDefault(require("./WhereBuilder"));
var FilterBuilder = /** @class */ (function () {
    // private readonly queryBuilder: SelectQueryBuilder<Entity>;
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
        var whereBuilder = new WhereBuilder_1.default(queryBuilder, query, this.alias);
        whereBuilder.build();
        var orderBuilder = new OrderBuilder_1.default(queryBuilder, query, this.alias);
        orderBuilder.build();
        var pageBuilder = new PageBuilder_1.default(queryBuilder, query);
        pageBuilder.build();
        return queryBuilder;
    };
    return FilterBuilder;
}());
exports.default = FilterBuilder;
