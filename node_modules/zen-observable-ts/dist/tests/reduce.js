"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var zenObservable_1 = require("../src/zenObservable");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var assert = chai.assert;
describe('reduce ', function () {
    it('No seed', function () {
        return zenObservable_1.default.from([1, 2, 3, 4, 5, 6])
            .reduce(function (a, b) {
            return a + b;
        })
            .forEach(function (x) {
            assert.equal(x, 21);
        });
    });
    it('No seed - one value', function () {
        return zenObservable_1.default.from([1])
            .reduce(function (a, b) {
            return a + b;
        })
            .forEach(function (x) {
            assert.equal(x, 1);
        });
    });
    it('No seed - empty (throws)', function () {
        return zenObservable_1.default.from([])
            .reduce(function (a, b) {
            return a + b;
        })
            .forEach(function () { return null; })
            .then(function () { return assert(false); }, function () { return assert(true); });
    });
    it('Seed', function () {
        return zenObservable_1.default.from([1, 2, 3, 4, 5, 6])
            .reduce(function (a, b) {
            return a + b;
        }, 100)
            .forEach(function (x) {
            assert.equal(x, 121);
        });
    });
    it('Seed - empty', function () {
        return zenObservable_1.default.from([])
            .reduce(function (a, b) {
            return a + b;
        }, 100)
            .forEach(function (x) {
            assert.equal(x, 100);
        });
    });
    it('throws on not a function', function () {
        return assert.throws(function () {
            return zenObservable_1.default.from([1, 2, 3, 4]).reduce(1).forEach(function (x) { return void 0; }).then;
        });
    });
    it('throws on error inside function', function (done) {
        var error = new Error('thrown');
        return assert.doesNotThrow(function () {
            return zenObservable_1.default.from([1, 2, 3, 4])
                .reduce(function () {
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
        return assert.doesNotThrow(function () {
            return obs
                .reduce(function (a, b) {
                return a + b;
            }, 100)
                .forEach(function (x) {
                assert.equal(x, 110);
            }).then;
        });
    });
    it('does not throw on internally closed subscription', function () {
        var obs = new zenObservable_1.default(function (observer) {
            observer.next(1);
            observer.next(1);
            observer.complete();
            observer.next(1);
        });
        return assert.doesNotThrow(function () {
            return obs
                .reduce(function (a, b) {
                return a + b;
            }, 100)
                .forEach(function (x) {
                assert.equal(x, 102);
            }).then;
        });
    });
});
//# sourceMappingURL=reduce.js.map