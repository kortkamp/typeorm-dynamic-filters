"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterBuilder = exports.test = void 0;
var OrderBuilder_1 = __importDefault(require("./OrderBuilder"));
var PageBuilder_1 = __importDefault(require("./PageBuilder"));
var WhereBuilder_1 = __importDefault(require("./WhereBuilder"));
var test = function (entityRepository) {
    return entityRepository.createQueryBuilder();
};
exports.test = test;
var FilterBuilder = /** @class */ (function () {
    function FilterBuilder(entityRepository, alias) {
        this.entityRepository = entityRepository;
        this.alias = alias;
    }
    // verifyColumnExists(column: string, repo: Repository<Entity>): void {
    //   const columnExists = repo.metadata.findColumnWithPropertyName(column);
    //   if (!columnExists) {
    //     throw new Error(
    //       `Value ${column} is not valid for field filterBy ou orderBy`,
    //     );
    //   }
    // }
    FilterBuilder.prototype.build = function (query) {
        var queryBuilder = this.entityRepository.createQueryBuilder(this.alias);
        // if (query.orderBy) {
        //   this.verifyColumnExists(query.orderBy, this.entityRepository);
        // }
        // query.filterBy.forEach(filterItem =>
        //   this.verifyColumnExists(filterItem, this.entityRepository),
        // );
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
exports.FilterBuilder = FilterBuilder;
