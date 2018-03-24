"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var link_1 = require("./link");
exports.execute = link_1.execute;
exports.ApolloLink = link_1.ApolloLink;
var linkUtils_1 = require("./linkUtils");
exports.makePromise = linkUtils_1.makePromise;
var zen_observable_ts_1 = require("zen-observable-ts");
exports.Observable = zen_observable_ts_1.default;
__export(require("zen-observable-ts"));
exports.default = link_1.ApolloLink;
//# sourceMappingURL=index.js.map