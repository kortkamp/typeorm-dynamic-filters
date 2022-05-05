"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OrderBuilder = /** @class */ (function () {
    function OrderBuilder(queryBuilder, order, alias) {
        this.queryBuilder = queryBuilder;
        this.order = order;
        this.alias = alias;
    }
    OrderBuilder.prototype.build = function () {
        if (!this.order.orderBy)
            return;
        var orderColumn = "".concat(this.alias, ".").concat(this.order.orderBy);
        this.queryBuilder.orderBy(orderColumn, this.order.orderType);
    };
    return OrderBuilder;
}());
exports.default = OrderBuilder;
