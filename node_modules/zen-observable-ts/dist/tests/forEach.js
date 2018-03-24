"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var zenObservable_1 = require("../src/zenObservable");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var assert = chai.assert;
describe('forEach ', function () {
    it('throws on not a function', function () {
        return assert.throws(zenObservable_1.default.from([1, 2, 3, 4]).forEach(1).then);
    });
    it('throws on not a function', function () {
        var error = new Error('completed');
        return new zenObservable_1.default(function (observer) {
            observer.complete();
            throw error;
        })
            .forEach(function (x) { return x; })
            .catch(function (err) { return assert.deepEqual(err, error); });
    });
});
//# sourceMappingURL=forEach.js.map