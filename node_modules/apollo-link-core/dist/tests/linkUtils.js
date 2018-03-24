"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var LinkUtils = require("../src/linkUtils");
var zen_observable_ts_1 = require("zen-observable-ts");
describe('Link utilities:', function () {
    describe('validateOperation', function () {
        it('should throw when invalid field in operation', function () {
            chai_1.assert.throws(function () {
                return LinkUtils.validateOperation({
                    qwerty: '',
                });
            });
        });
        it('should not throw when valid fields in operation', function () {
            chai_1.assert.doesNotThrow(function () {
                return LinkUtils.validateOperation({
                    query: '',
                    context: {},
                    variables: {},
                });
            });
        });
    });
    describe('makePromise', function () {
        var data = {
            data: {
                hello: 'world',
            },
        };
        var error = new Error('I always error');
        it('return next call as Promise resolution', function () {
            return LinkUtils.makePromise(zen_observable_ts_1.default.of(data)).then(function (result) {
                return chai_1.assert.deepEqual(data, result);
            });
        });
        it('return error call as Promise rejection', function () {
            return LinkUtils.makePromise(new zen_observable_ts_1.default(function (observer) { return observer.error(error); }))
                .then(chai_1.expect.fail)
                .catch(function (actualError) { return chai_1.assert.deepEqual(error, actualError); });
        });
        describe('warnings', function () {
            var spy = sinon.stub();
            var _warn;
            before(function () {
                _warn = console.warn;
                console.warn = spy;
            });
            after(function () {
                console.warn = _warn;
            });
            it('return error call as Promise rejection', function (done) {
                spy.callsFake(function () { return done(); });
                LinkUtils.makePromise(zen_observable_ts_1.default.of(data, data)).then(function (result) {
                    return chai_1.assert.deepEqual(data, result);
                });
            });
        });
    });
});
//# sourceMappingURL=linkUtils.js.map