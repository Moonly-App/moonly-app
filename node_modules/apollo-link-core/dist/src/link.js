"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var linkUtils_1 = require("./linkUtils");
var graphql_tag_1 = require("graphql-tag");
var zen_observable_ts_1 = require("zen-observable-ts");
var ApolloLink = (function () {
    function ApolloLink() {
    }
    ApolloLink.from = function (links) {
        if (links.length === 0) {
            return ApolloLink.empty();
        }
        return links.map(linkUtils_1.toLink).reduce(function (x, y) { return x.concat(y); });
    };
    ApolloLink.empty = function () {
        return new FunctionLink(function (op, forward) { return zen_observable_ts_1.default.of(); });
    };
    ApolloLink.passthrough = function () {
        return new FunctionLink(function (op, forward) { return (forward ? forward(op) : zen_observable_ts_1.default.of()); });
    };
    ApolloLink.split = function (test, left, right) {
        if (right === void 0) { right = ApolloLink.passthrough(); }
        var leftLink = linkUtils_1.validateLink(linkUtils_1.toLink(left));
        var rightLink = linkUtils_1.validateLink(linkUtils_1.toLink(right));
        if (linkUtils_1.isTerminating(leftLink) && linkUtils_1.isTerminating(rightLink)) {
            return new FunctionLink(function (operation) {
                return test(operation)
                    ? leftLink.request(operation) || zen_observable_ts_1.default.of()
                    : rightLink.request(operation) || zen_observable_ts_1.default.of();
            });
        }
        else {
            return new FunctionLink(function (operation, forward) {
                return test(operation)
                    ? leftLink.request(operation, forward) || zen_observable_ts_1.default.of()
                    : rightLink.request(operation, forward) || zen_observable_ts_1.default.of();
            });
        }
    };
    ApolloLink.prototype.split = function (test, left, right) {
        if (right === void 0) { right = ApolloLink.passthrough(); }
        return this.concat(ApolloLink.split(test, left, right));
    };
    ApolloLink.prototype.concat = function (next) {
        var _this = this;
        linkUtils_1.validateLink(this);
        if (linkUtils_1.isTerminating(this)) {
            console.warn(new linkUtils_1.LinkError("You are calling concat on a terminating link, which will have no effect", this));
            return this;
        }
        var nextLink = linkUtils_1.validateLink(linkUtils_1.toLink(next));
        if (linkUtils_1.isTerminating(nextLink)) {
            return new FunctionLink(function (operation) {
                return _this.request(operation, function (op) { return nextLink.request(op) || zen_observable_ts_1.default.of(); }) || zen_observable_ts_1.default.of();
            });
        }
        else {
            return new FunctionLink(function (operation, forward) {
                return (_this.request(operation, function (op) {
                    return nextLink.request(op, forward) || zen_observable_ts_1.default.of();
                }) || zen_observable_ts_1.default.of());
            });
        }
    };
    return ApolloLink;
}());
exports.ApolloLink = ApolloLink;
function execute(link, operation) {
    var copy = __assign({}, operation);
    linkUtils_1.validateOperation(copy);
    if (!copy.context) {
        copy.context = {};
    }
    if (!copy.variables) {
        copy.variables = {};
    }
    if (!copy.query) {
        console.warn("query should either be a string or GraphQL AST");
        copy.query = {};
    }
    return link.request(transformOperation(copy)) || zen_observable_ts_1.default.of();
}
exports.execute = execute;
function getName(node) {
    return node && node.name && node.name.kind === 'Name' && node.name.value;
}
function transformOperation(operation) {
    var transformedOperation;
    if (typeof operation.query === 'string') {
        transformedOperation = __assign({}, operation, { query: graphql_tag_1.default(operation.query) });
    }
    else {
        transformedOperation = __assign({}, operation);
    }
    if (transformedOperation.query && transformedOperation.query.definitions) {
        if (!transformedOperation.operationName) {
            var operationTypes_1 = ['query', 'mutation', 'subscription'];
            var definitions = transformedOperation.query.definitions.filter(function (x) {
                return x.kind === 'OperationDefinition' &&
                    operationTypes_1.indexOf(x.operation) >= 0;
            });
            transformedOperation.operationName = getName(definitions[0]) || '';
        }
    }
    else if (!transformedOperation.operationName) {
        transformedOperation.operationName = '';
    }
    return transformedOperation;
}
var FunctionLink = (function (_super) {
    __extends(FunctionLink, _super);
    function FunctionLink(f) {
        var _this = _super.call(this) || this;
        _this.f = f;
        _this.request = f;
        return _this;
    }
    FunctionLink.prototype.request = function (operation, forward) {
        throw Error('should be overridden');
    };
    return FunctionLink;
}(ApolloLink));
exports.FunctionLink = FunctionLink;
//# sourceMappingURL=link.js.map