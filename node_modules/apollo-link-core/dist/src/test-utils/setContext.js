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
Object.defineProperty(exports, "__esModule", { value: true });
var link_1 = require("../link");
var SetContextLink = (function (_super) {
    __extends(SetContextLink, _super);
    function SetContextLink(setContext) {
        if (setContext === void 0) { setContext = function (c) { return c; }; }
        var _this = _super.call(this) || this;
        _this.setContext = setContext;
        return _this;
    }
    SetContextLink.prototype.request = function (operation, forward) {
        if (!operation.context) {
            operation.context = {};
        }
        operation.context = this.setContext(operation.context);
        return forward(operation);
    };
    return SetContextLink;
}(link_1.ApolloLink));
exports.default = SetContextLink;
//# sourceMappingURL=setContext.js.map