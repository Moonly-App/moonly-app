"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var zenObservable_1 = require("../src/zenObservable");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var assert = chai.assert;
describe('map', function () {
    it('Basics', function () {
        var list = [];
        return zenObservable_1.default.from([1, 2, 3])
            .map(function (x) { return x * 2; })
            .forEach(function (x) { return list.push(x); })
            .then(function () { return assert.deepEqual(list, [2, 4, 6]); });
    });
    it('throws on not a function', function () {
        return assert.throws(function () { return zenObservable_1.default.from([1, 2, 3, 4]).map(1).forEach(function (x) { return void 0; }).then; });
    });
    it('throws on error inside function', function (done) {
        var error = new Error('thrown');
        return assert.doesNotThrow(function () {
            return zenObservable_1.default.from([1, 2, 3, 4])
                .map(function () {
                throw error;
            })
                .subscribe({
                error: function (err) {
                    assert.equal(err, error);
                    done();
                },
            });
        });
    });
    it('does not throw on closed subscription', function () {
        var obs = zenObservable_1.default.from([1, 2, 3, 4]);
        obs.subscribe({}).unsubscribe();
        return assert.doesNotThrow(function () { return obs.map(function (x) { return x * 2; }).forEach(function (x) { return void 0; }).then; });
    });
    it('does not throw on internally closed subscription', function () {
        var obs = new zenObservable_1.default(function (observer) {
            observer.next(1);
            observer.next(1);
            observer.complete();
            observer.next(1);
        });
        return assert.doesNotThrow(function () { return obs.map(function (x) { return x * 2; }).forEach(function (x) { return void 0; }).then; });
    });
});
//# sourceMappingURL=map.js.map