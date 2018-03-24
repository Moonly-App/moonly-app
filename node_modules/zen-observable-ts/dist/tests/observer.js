"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var zenObservable_1 = require("../src/zenObservable");
describe('of', function () {
    it('Basics', function () {
        var list = [];
        return zenObservable_1.default.of(1, 2, 3)
            .map(function (x) { return x * 2; })
            .forEach(function (x) { return list.push(x); })
            .then(function () { return chai_1.assert.deepEqual(list, [2, 4, 6]); });
    });
});
describe('subscription', function () {
    it('can close multiple times', function () {
        var sub = zenObservable_1.default.of(1).subscribe({});
        sub.unsubscribe();
        sub.unsubscribe();
    });
    it('can close multiple times', function () {
        var sub = zenObservable_1.default.of(1, 2).subscribe({});
        sub = zenObservable_1.default.of(1, 2).subscribe({
            next: sub.unsubscribe,
        });
    });
});
describe('observer', function () {
    it('throws when cleanup is not a function', function () {
        chai_1.assert.throws(function () {
            var sub = new zenObservable_1.default(function (observer) {
                return 1;
            }).subscribe({});
            sub.unsubscribe();
        });
    });
    it('recalling next, error, complete have no effect', function () {
        var spy = sinon.spy();
        var list = [];
        return new zenObservable_1.default(function (observer) {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
            observer.next(4);
            observer.complete();
            spy();
        })
            .map(function (x) { return x * 2; })
            .forEach(function (x) { return list.push(x); })
            .then(function () { return chai_1.assert.deepEqual(list, [2, 4, 6]); })
            .then(function () { return chai_1.assert(spy.called); });
    });
    it('throws on non function Observer', function () {
        chai_1.assert.throws(function () { return new zenObservable_1.default(1); });
    });
    it('completes after error', function () {
        var error = new Error('completed');
        return new Promise(function (resolve, reject) {
            return new zenObservable_1.default(function (observer) {
                observer.complete();
            }).subscribe({
                complete: function () {
                    reject(error);
                },
            });
        }).catch(function (err) { return chai_1.assert.deepEqual(err, error); });
    });
    it('calling without options does not throw', function () {
        new zenObservable_1.default(function (observer) {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
        }).subscribe({});
    });
    it('calling without options does not throw', function () {
        var num = 0;
        return new Promise(function (resolve, reject) {
            new zenObservable_1.default(function (observer) {
                observer.next(1);
                observer.next(2);
                observer.next(3);
                observer.complete();
            }).subscribe(function (val) { return chai_1.assert.equal(++num, val); }, reject, resolve);
        });
    });
    it('throws error after complete', function () {
        var spy = sinon.spy();
        var error = new Error('throws');
        return new Promise(function (resolve, reject) {
            new zenObservable_1.default(function (observer) {
                observer.complete();
                observer.error(error);
                spy();
            }).subscribe({
                next: reject,
                error: reject,
            });
        }).catch(function (err) {
            chai_1.assert(spy.notCalled);
            chai_1.assert.deepEqual(err, error);
        });
    });
});
//# sourceMappingURL=observer.js.map