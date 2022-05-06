"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBuild = void 0;
var orderBuild = function (queryBuilder, order, alias) {
    if (!order.orderBy)
        return;
    var orderColumn = "".concat(alias, ".").concat(order.orderBy);
    queryBuilder.orderBy(orderColumn, order.orderType);
};
exports.orderBuild = orderBuild;
