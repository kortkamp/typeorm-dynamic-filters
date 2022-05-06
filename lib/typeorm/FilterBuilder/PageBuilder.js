"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageBuild = void 0;
var pageBuild = function (queryBuilder, pagination) {
    if (!(pagination === null || pagination === void 0 ? void 0 : pagination.per_page)) {
        return;
    }
    var page = pagination.page
        ? (pagination.page - 1) * pagination.per_page
        : undefined;
    queryBuilder.take(pagination.per_page);
    queryBuilder.skip(page);
};
exports.pageBuild = pageBuild;
