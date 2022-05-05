"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PageBuilder = /** @class */ (function () {
    function PageBuilder(queryBuilder, pagination) {
        this.queryBuilder = queryBuilder;
        this.pagination = pagination;
    }
    PageBuilder.prototype.build = function () {
        var _a;
        if (!((_a = this.pagination) === null || _a === void 0 ? void 0 : _a.per_page)) {
            return;
        }
        var page = this.pagination.page
            ? (this.pagination.page - 1) * this.pagination.per_page
            : undefined;
        this.queryBuilder.take(this.pagination.per_page);
        this.queryBuilder.skip(page);
    };
    return PageBuilder;
}());
exports.default = PageBuilder;
