"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var zenObservable_1 = require("../src/zenObservable");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var assert = chai.assert;
describe('flatMap', function () {
    it('Observable.from', function () {
        var list = [];
        return zenObservable_1.default.from([1, 2, 3])
            .flatMap(function (x) {
            return zenObservable_1.default.from([x * 1, x * 2, x * 3]);
        })
            .forEach(function (x) {
            list.push(x);
        })
            .then(function () {
            assert.deepEqual(list, [1, 2, 3, 2, 4, 6, 3, 6, 9]);
        });
    });
    it('Error if return value is not observable', function () {
        return zenObservable_1.default.from([1, 2, 3])
            .flatMap(function () {
            return 1;
        })
            .forEach(function () { return null; })
            .then(function () { return assert(false); }, function () { return assert(true); });
    });
    it('throws on not a function', function () {
        return assert.throws(function () {
            return zenObservable_1.default.from([1, 2, 3, 4]).flatMap(1).forEach(function (x) { return void 0; }).then;
        });
    });
    it('throws on error inside function', function (done) {
        var error = new Error('thrown');
        return assert.doesNotThrow(function () {
            return zenObservable_1.default.from([1, 2, 3, 4])
                .flatMap(function () {
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
    it('calls inner unsubscribe', function (done) {
        zenObservable_1.default.from(zenObservable_1.default.of(1))
            .flatMap(function (x) {
            return new zenObservable_1.default(function (observer) { return done; });
        })
            .subscribe({})
            .unsubscribe();
    });
    it('does not throw on closed subscription', function () {
        var list = [];
        var obs = zenObservable_1.default.from([1, 2, 3, 4]);
        obs.subscribe({}).unsubscribe();
        return assert.doesNotThrow(function () {
            return obs
                .flatMap(function (x) {
                return zenObservable_1.default.from([x * 1, x * 2, x * 3]);
            })
                .forEach(function (x) {
                list.push(x);
            }).then;
        });
    });
    it('does not throw on internally closed subscription', function () {
        var list = [];
        var obs = new zenObservable_1.default(function (observer) {
            observer.next(1);
            observer.next(1);
            observer.complete();
            observer.next(1);
        });
        obs.subscribe({}).unsubscribe();
        return assert.doesNotThrow(function () {
            return obs
                .flatMap(function (x) {
                return zenObservable_1.default.from([x * 1, x * 2, x * 3]);
            })
                .forEach(function (x) {
                list.push(x);
            }).then;
        });
    });
});
//# sourceMappingURL=flatMap.js.map