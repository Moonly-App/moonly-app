"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var link_1 = require("../src/link");
var zen_observable_ts_1 = require("zen-observable-ts");
var test_utils_1 = require("../src/test-utils");
var graphql_tag_1 = require("graphql-tag");
var test_utils_2 = require("../src/test-utils");
var sampleQuery = "query SampleQuery{\n  stub{\n    id\n  }\n}";
describe('ApolloLink(abstract class)', function () {
    var setContext = function () { return ({ add: 1 }); };
    describe('concat', function () {
        it('should concat a function', function (done) {
            var returnOne = new test_utils_1.SetContextLink(setContext);
            var link = returnOne.concat(function (operation, forward) {
                return zen_observable_ts_1.default.of({ data: { count: operation.context.add } });
            });
            test_utils_2.testLinkResults({
                link: link,
                results: [{ count: 1 }],
                done: done,
            });
        });
        it('should concat a Link', function (done) {
            var returnOne = new test_utils_1.SetContextLink(setContext);
            var mock = new test_utils_1.MockLink(function (op) { return zen_observable_ts_1.default.of({ data: op.context.add }); });
            var link = returnOne.concat(mock);
            test_utils_2.testLinkResults({
                link: link,
                results: [1],
                done: done,
            });
        });
        it("should pass error to observable's error", function (done) {
            var error = new Error('thrown');
            var returnOne = new test_utils_1.SetContextLink(setContext);
            var mock = new test_utils_1.MockLink(function (op) {
                return new zen_observable_ts_1.default(function (observer) {
                    observer.next({ data: op.context.add });
                    observer.error(error);
                });
            });
            var link = returnOne.concat(mock);
            test_utils_2.testLinkResults({
                link: link,
                results: [1, error],
                done: done,
            });
        });
        it('should concat a Link and function', function (done) {
            var returnOne = new test_utils_1.SetContextLink(setContext);
            var mock = new test_utils_1.MockLink(function (op, forward) {
                var _op = __assign({}, op, { context: {
                        add: op.context.add + 2,
                    } });
                return forward(_op);
            });
            var link = returnOne.concat(mock).concat(function (op) {
                return zen_observable_ts_1.default.of({ data: op.context.add });
            });
            test_utils_2.testLinkResults({
                link: link,
                results: [3],
                done: done,
            });
        });
        it('should concat a function and Link', function (done) {
            var returnOne = new test_utils_1.SetContextLink(setContext);
            var mock = new test_utils_1.MockLink(function (op, forward) {
                return zen_observable_ts_1.default.of({ data: op.context.add });
            });
            var link = returnOne
                .concat(function (operation, forward) {
                operation = __assign({}, operation, { context: {
                        add: operation.context.add + 2,
                    } });
                return forward(operation);
            })
                .concat(mock);
            test_utils_2.testLinkResults({
                link: link,
                results: [3],
                done: done,
            });
        });
        it('should concat two functions', function (done) {
            var returnOne = new test_utils_1.SetContextLink(setContext);
            var link = returnOne
                .concat(function (operation, forward) {
                operation = __assign({}, operation, { context: {
                        add: operation.context.add + 2,
                    } });
                return forward(operation);
            })
                .concat(function (op, forward) { return zen_observable_ts_1.default.of({ data: op.context.add }); });
            test_utils_2.testLinkResults({
                link: link,
                results: [3],
                done: done,
            });
        });
        it('should concat two Links', function (done) {
            var returnOne = new test_utils_1.SetContextLink(setContext);
            var mock1 = new test_utils_1.MockLink(function (operation, forward) {
                operation = __assign({}, operation, { context: {
                        add: operation.context.add + 2,
                    } });
                return forward(operation);
            });
            var mock2 = new test_utils_1.MockLink(function (op, forward) {
                return zen_observable_ts_1.default.of({ data: op.context.add });
            });
            var link = returnOne.concat(mock1).concat(mock2);
            test_utils_2.testLinkResults({
                link: link,
                results: [3],
                done: done,
            });
        });
        it("should return an link that can be concat'd multiple times", function (done) {
            var returnOne = new test_utils_1.SetContextLink(setContext);
            var mock1 = new test_utils_1.MockLink(function (operation, forward) {
                operation = __assign({}, operation, { context: {
                        add: operation.context.add + 2,
                    } });
                return forward(operation);
            });
            var mock2 = new test_utils_1.MockLink(function (op, forward) {
                return zen_observable_ts_1.default.of({ data: op.context.add + 2 });
            });
            var mock3 = new test_utils_1.MockLink(function (op, forward) {
                return zen_observable_ts_1.default.of({ data: op.context.add + 3 });
            });
            var link = returnOne.concat(mock1);
            test_utils_2.testLinkResults({
                link: link.concat(mock2),
                results: [5],
            });
            test_utils_2.testLinkResults({
                link: link.concat(mock3),
                results: [6],
                done: done,
            });
        });
    });
    describe('split', function () {
        it('should split two functions', function (done) {
            var context = { add: 1 };
            var returnOne = new test_utils_1.SetContextLink(function () { return context; });
            var link1 = returnOne.concat(function (operation, forward) {
                return zen_observable_ts_1.default.of({ data: operation.context.add + 1 });
            });
            var link2 = returnOne.concat(function (operation, forward) {
                return zen_observable_ts_1.default.of({ data: operation.context.add + 2 });
            });
            var link = returnOne.split(function (operation) { return operation.context.add === 1; }, link1, link2);
            test_utils_2.testLinkResults({
                link: link,
                results: [2],
            });
            context.add = 2;
            test_utils_2.testLinkResults({
                link: link,
                results: [4],
                done: done,
            });
        });
        it('should split two Links', function (done) {
            var context = { add: 1 };
            var returnOne = new test_utils_1.SetContextLink(function () { return context; });
            var link1 = returnOne.concat(new test_utils_1.MockLink(function (operation, forward) {
                return zen_observable_ts_1.default.of({ data: operation.context.add + 1 });
            }));
            var link2 = returnOne.concat(new test_utils_1.MockLink(function (operation, forward) {
                return zen_observable_ts_1.default.of({ data: operation.context.add + 2 });
            }));
            var link = returnOne.split(function (operation) { return operation.context.add === 1; }, link1, link2);
            test_utils_2.testLinkResults({
                link: link,
                results: [2],
            });
            context.add = 2;
            test_utils_2.testLinkResults({
                link: link,
                results: [4],
                done: done,
            });
        });
        it('should split a link and a function', function (done) {
            var context = { add: 1 };
            var returnOne = new test_utils_1.SetContextLink(function () { return context; });
            var link1 = returnOne.concat(function (operation, forward) {
                return zen_observable_ts_1.default.of({ data: operation.context.add + 1 });
            });
            var link2 = returnOne.concat(new test_utils_1.MockLink(function (operation, forward) {
                return zen_observable_ts_1.default.of({ data: operation.context.add + 2 });
            }));
            var link = returnOne.split(function (operation) { return operation.context.add === 1; }, link1, link2);
            test_utils_2.testLinkResults({
                link: link,
                results: [2],
            });
            context.add = 2;
            test_utils_2.testLinkResults({
                link: link,
                results: [4],
                done: done,
            });
        });
        it('should allow concat after split to be join', function (done) {
            var context = { test: true, add: 1 };
            var start = new test_utils_1.SetContextLink(function () { return (__assign({}, context)); });
            var link = start
                .split(function (operation) { return operation.context.test; }, function (operation, forward) {
                operation.context.add++;
                return forward(operation);
            }, function (operation, forward) {
                operation.context.add += 2;
                return forward(operation);
            })
                .concat(function (operation) { return zen_observable_ts_1.default.of({ data: operation.context.add }); });
            test_utils_2.testLinkResults({
                link: link,
                context: context,
                results: [2],
            });
            context.test = false;
            test_utils_2.testLinkResults({
                link: link,
                context: context,
                results: [3],
                done: done,
            });
        });
        it('should allow default right to be empty or passthrough when forward available', function (done) {
            var context = { test: true };
            var start = new test_utils_1.SetContextLink(function () { return context; });
            var link = start.split(function (operation) { return operation.context.test; }, function (operation) {
                return zen_observable_ts_1.default.of({
                    data: {
                        count: 1,
                    },
                });
            });
            var concat = link.concat(function (operation) {
                return zen_observable_ts_1.default.of({
                    data: {
                        count: 2,
                    },
                });
            });
            test_utils_2.testLinkResults({
                link: link,
                results: [{ count: 1 }],
            });
            context.test = false;
            test_utils_2.testLinkResults({
                link: link,
                results: [],
            });
            test_utils_2.testLinkResults({
                link: concat,
                results: [{ count: 2 }],
                done: done,
            });
        });
    });
    describe('empty', function () {
        it('should returns an immediately completed Observable', function (done) {
            test_utils_2.testLinkResults({
                link: link_1.ApolloLink.empty(),
                done: done,
            });
        });
    });
});
describe('Link static library', function () {
    describe('from', function () {
        var uniqueOperation = {
            query: graphql_tag_1.default(sampleQuery),
            context: { name: 'uniqueName' },
            operationName: 'sampleQuery',
        };
        it('should create an observable that completes when passed an empty array', function (done) {
            var observable = link_1.execute(link_1.ApolloLink.from([]), {
                query: graphql_tag_1.default(sampleQuery),
            });
            observable.subscribe(function () { return chai_1.assert(false, 'should not call next'); }, function () { return chai_1.assert(false, 'should not call error'); }, done);
        });
        it('can create chain of one', function () {
            chai_1.assert.doesNotThrow(function () { return link_1.ApolloLink.from([new test_utils_1.MockLink()]); });
        });
        it('can create chain of two', function () {
            chai_1.assert.doesNotThrow(function () {
                return link_1.ApolloLink.from([
                    new test_utils_1.MockLink(function (operation, forward) { return forward(operation); }),
                    new test_utils_1.MockLink(),
                ]);
            });
        });
        it('should receive result of one link', function (done) {
            var data = {
                data: {
                    hello: 'world',
                },
            };
            var chain = link_1.ApolloLink.from([new test_utils_1.MockLink(function () { return zen_observable_ts_1.default.of(data); })]);
            var observable = link_1.execute(chain, uniqueOperation);
            observable.subscribe({
                next: function (actualData) {
                    chai_1.assert.deepEqual(data, actualData);
                },
                error: function () { return chai_1.expect.fail(); },
                complete: function () { return done(); },
            });
        });
        it('should accept sting query and pass AST to link', function (done) {
            var astOperation = __assign({}, uniqueOperation, { query: graphql_tag_1.default(sampleQuery) });
            var operation = __assign({}, uniqueOperation, { query: sampleQuery });
            var stub = sinon.stub().withArgs(astOperation).callsFake(function (op) {
                chai_1.assert.deepEqual(__assign({}, astOperation, { variables: {} }), op);
                done();
            });
            var chain = link_1.ApolloLink.from([new test_utils_1.MockLink(stub)]);
            link_1.execute(chain, operation);
        });
        it('should accept AST query and pass AST to link', function (done) {
            var astOperation = __assign({}, uniqueOperation, { query: graphql_tag_1.default(sampleQuery) });
            var stub = sinon.stub().withArgs(astOperation).callsFake(function (op) {
                chai_1.assert.deepEqual(__assign({}, astOperation, { variables: {} }), op);
                done();
            });
            var chain = link_1.ApolloLink.from([new test_utils_1.MockLink(stub)]);
            link_1.execute(chain, astOperation);
        });
        it('should pass operation from one link to next with modifications', function (done) {
            var chain = link_1.ApolloLink.from([
                new test_utils_1.MockLink(function (op, forward) {
                    return forward(__assign({}, op, { query: graphql_tag_1.default(sampleQuery) }));
                }),
                new test_utils_1.MockLink(function (op) {
                    chai_1.assert.deepEqual(__assign({}, uniqueOperation, { query: graphql_tag_1.default(sampleQuery), variables: {} }), op);
                    return done();
                }),
            ]);
            link_1.execute(chain, uniqueOperation);
        });
        it('should pass result of one link to another with forward', function (done) {
            var data = {
                data: {
                    hello: 'world',
                },
            };
            var chain = link_1.ApolloLink.from([
                new test_utils_1.MockLink(function (op, forward) {
                    var observable = forward(op);
                    observable.subscribe({
                        next: function (actualData) {
                            chai_1.assert.deepEqual(data, actualData);
                        },
                        error: chai_1.expect.fail,
                        complete: done,
                    });
                    return observable;
                }),
                new test_utils_1.MockLink(function () { return zen_observable_ts_1.default.of(data); }),
            ]);
            link_1.execute(chain, uniqueOperation);
        });
        it('should receive final result of two link chain', function (done) {
            var data = {
                data: {
                    hello: 'world',
                },
            };
            var chain = link_1.ApolloLink.from([
                new test_utils_1.MockLink(function (op, forward) {
                    var observable = forward(op);
                    return new zen_observable_ts_1.default(function (observer) {
                        observable.subscribe({
                            next: function (actualData) {
                                chai_1.assert.deepEqual(data, actualData);
                                observer.next({
                                    data: __assign({}, actualData.data, { modification: 'unique' }),
                                });
                            },
                            error: function (error) { return observer.error(error); },
                            complete: function () { return observer.complete(); },
                        });
                    });
                }),
                new test_utils_1.MockLink(function () { return zen_observable_ts_1.default.of(data); }),
            ]);
            var result = link_1.execute(chain, uniqueOperation);
            result.subscribe({
                next: function (modifiedData) {
                    chai_1.assert.deepEqual({
                        data: __assign({}, data.data, { modification: 'unique' }),
                    }, modifiedData);
                },
                error: chai_1.expect.fail,
                complete: done,
            });
        });
        it('should chain together a function with links', function (done) {
            var add1 = function (operation, forward) {
                operation.context.num++;
                return forward(operation);
            };
            var add1Link = new test_utils_1.MockLink(function (operation, forward) {
                operation.context.num++;
                return forward(operation);
            });
            var link = link_1.ApolloLink.from([
                add1,
                add1,
                add1Link,
                add1,
                add1Link,
                function (operation) { return zen_observable_ts_1.default.of({ data: operation.context }); },
            ]);
            test_utils_2.testLinkResults({
                link: link,
                results: [{ num: 5 }],
                context: { num: 0 },
                done: done,
            });
        });
    });
    describe('split', function () {
        it('should create filter when single link passed in', function (done) {
            var link = link_1.ApolloLink.split(function (operation) { return operation.context.test; }, function (operation, forward) { return zen_observable_ts_1.default.of({ data: { count: 1 } }); });
            var context = { test: true };
            test_utils_2.testLinkResults({
                link: link,
                results: [{ count: 1 }],
                context: context,
            });
            context.test = false;
            test_utils_2.testLinkResults({
                link: link,
                results: [],
                context: context,
                done: done,
            });
        });
        it('should split two functions', function (done) {
            var link = link_1.ApolloLink.split(function (operation) { return operation.context.test; }, function (operation, forward) { return zen_observable_ts_1.default.of({ data: { count: 1 } }); }, function (operation, forward) { return zen_observable_ts_1.default.of({ data: { count: 2 } }); });
            var context = { test: true };
            test_utils_2.testLinkResults({
                link: link,
                results: [{ count: 1 }],
                context: context,
            });
            context.test = false;
            test_utils_2.testLinkResults({
                link: link,
                results: [{ count: 2 }],
                context: context,
                done: done,
            });
        });
        it('should split two Links', function (done) {
            var link = link_1.ApolloLink.split(function (operation) { return operation.context.test; }, function (operation, forward) { return zen_observable_ts_1.default.of({ data: { count: 1 } }); }, new test_utils_1.MockLink(function (operation, forward) {
                return zen_observable_ts_1.default.of({ data: { count: 2 } });
            }));
            var context = { test: true };
            test_utils_2.testLinkResults({
                link: link,
                results: [{ count: 1 }],
                context: context,
            });
            context.test = false;
            test_utils_2.testLinkResults({
                link: link,
                results: [{ count: 2 }],
                context: context,
                done: done,
            });
        });
        it('should split a link and a function', function (done) {
            var link = link_1.ApolloLink.split(function (operation) { return operation.context.test; }, function (operation, forward) { return zen_observable_ts_1.default.of({ data: { count: 1 } }); }, new test_utils_1.MockLink(function (operation, forward) {
                return zen_observable_ts_1.default.of({ data: { count: 2 } });
            }));
            var context = { test: true };
            test_utils_2.testLinkResults({
                link: link,
                results: [{ count: 1 }],
                context: context,
            });
            context.test = false;
            test_utils_2.testLinkResults({
                link: link,
                results: [{ count: 2 }],
                context: context,
                done: done,
            });
        });
        it('should allow concat after split to be join', function (done) {
            var context = { test: true };
            var link = link_1.ApolloLink.split(function (operation) { return operation.context.test; }, function (operation, forward) {
                return forward(operation).map(function (data) { return ({
                    data: { count: data.data.count + 1 },
                }); });
            }).concat(function () { return zen_observable_ts_1.default.of({ data: { count: 1 } }); });
            test_utils_2.testLinkResults({
                link: link,
                context: context,
                results: [{ count: 2 }],
            });
            context.test = false;
            test_utils_2.testLinkResults({
                link: link,
                context: context,
                results: [{ count: 1 }],
                done: done,
            });
        });
        it('should allow default right to be passthrough', function (done) {
            var context = { test: true };
            var link = link_1.ApolloLink.split(function (operation) { return operation.context.test; }, function (operation) { return zen_observable_ts_1.default.of({ data: { count: 2 } }); }).concat(function (operation) { return zen_observable_ts_1.default.of({ data: { count: 1 } }); });
            test_utils_2.testLinkResults({
                link: link,
                context: context,
                results: [{ count: 2 }],
            });
            context.test = false;
            test_utils_2.testLinkResults({
                link: link,
                context: context,
                results: [{ count: 1 }],
                done: done,
            });
        });
    });
    describe('execute', function () {
        var _warn;
        before(function () {
            _warn = console.warn;
            console.warn = sinon.stub().callsFake(function (warning) {
                chai_1.assert.deepEqual(warning, "query should either be a string or GraphQL AST");
            });
        });
        after(function () {
            console.warn = _warn;
        });
        it('should return an empty observable when a link returns null', function (done) {
            test_utils_2.testLinkResults({
                link: new test_utils_1.MockLink(),
                results: [],
                done: done,
            });
        });
        it('should return an empty observable when a link is empty', function (done) {
            test_utils_2.testLinkResults({
                link: link_1.ApolloLink.empty(),
                results: [],
                done: done,
            });
        });
        it("should return an empty observable when a concat'd link returns null", function (done) {
            var link = new test_utils_1.MockLink(function (operation, forward) {
                return forward(operation);
            }).concat(function () { return null; });
            test_utils_2.testLinkResults({
                link: link,
                results: [],
                done: done,
            });
        });
        it('should return an empty observable when a split link returns null', function (done) {
            var context = { test: true };
            var link = new test_utils_1.SetContextLink(function () { return context; }).split(function (op) { return op.context.test; }, function () { return zen_observable_ts_1.default.of(); }, function () { return null; });
            test_utils_2.testLinkResults({
                link: link,
                results: [],
            });
            context.test = false;
            test_utils_2.testLinkResults({
                link: link,
                results: [],
                done: done,
            });
        });
        it('should set a default context, variable, query and operationName on a copy of operation', function (done) {
            var operation = {};
            var link = link_1.ApolloLink.from([
                function (op) {
                    chai_1.assert.notProperty(operation, 'query');
                    chai_1.assert.notProperty(operation, 'operationName');
                    chai_1.assert.notProperty(operation, 'variables');
                    chai_1.assert.notProperty(operation, 'context');
                    chai_1.assert.property(op, 'query');
                    chai_1.assert.property(op, 'operationName');
                    chai_1.assert.property(op, 'variables');
                    chai_1.assert.property(op, 'context');
                    return zen_observable_ts_1.default.of();
                },
            ]);
            link_1.execute(link, operation).subscribe({
                complete: done,
            });
        });
    });
});
describe('Terminating links', function () {
    var _warn = console.warn;
    var warningStub = sinon.stub();
    var data = {
        stub: 'data',
    };
    before(function () {
        console.warn = warningStub;
    });
    beforeEach(function () {
        warningStub.reset();
        warningStub.callsFake(function (warning) {
            chai_1.assert.deepEqual(warning.message, "You are calling concat on a terminating link, which will have no effect");
        });
    });
    after(function () {
        console.warn = _warn;
    });
    describe('concat', function () {
        it('should warn if attempting to concat to a terminating Link from function', function () {
            var link = link_1.ApolloLink.from([function (operation) { return zen_observable_ts_1.default.of({ data: data }); }]);
            chai_1.assert.deepEqual(link.concat(function (operation, forward) { return forward(operation); }), link);
            chai_1.assert(warningStub.calledOnce);
            chai_1.assert.deepEqual(warningStub.firstCall.args[0].link, link);
        });
        it('should warn if attempting to concat to a terminating Link', function () {
            var link = new test_utils_1.MockLink(function (operation) { return zen_observable_ts_1.default.of(); });
            chai_1.assert.deepEqual(link.concat(function (operation, forward) { return forward(operation); }), link);
            chai_1.assert(warningStub.calledOnce);
            chai_1.assert.deepEqual(warningStub.firstCall.args[0].link, link);
        });
        it('should not warn if attempting concat a terminating Link at end', function () {
            var link = new test_utils_1.MockLink(function (operation, forward) { return forward(operation); });
            link.concat(function (operation) { return zen_observable_ts_1.default.of(); });
            chai_1.assert(warningStub.notCalled);
        });
    });
    describe('split', function () {
        it('should not warn if attempting to split a terminating and non-terminating Link', function () {
            var split = link_1.ApolloLink.split(function () { return true; }, function (operation) { return zen_observable_ts_1.default.of({ data: data }); }, function (operation, forward) { return forward(operation); });
            split.concat(function (operation, forward) { return forward(operation); });
            chai_1.assert(warningStub.notCalled);
        });
        it('should warn if attempting to concat to split two terminating links', function () {
            var split = link_1.ApolloLink.split(function () { return true; }, function (operation) { return zen_observable_ts_1.default.of({ data: data }); }, function (operation) { return zen_observable_ts_1.default.of({ data: data }); });
            chai_1.assert.deepEqual(split.concat(function (operation, forward) { return forward(operation); }), split);
            chai_1.assert(warningStub.calledOnce);
        });
        it('should warn if attempting to split to split two terminating links', function () {
            var split = link_1.ApolloLink.split(function () { return true; }, function (operation) { return zen_observable_ts_1.default.of({ data: data }); }, function (operation) { return zen_observable_ts_1.default.of({ data: data }); });
            chai_1.assert.deepEqual(split.split(function () { return true; }, function (operation, forward) { return forward(operation); }, function (operation, forward) { return forward(operation); }), split);
            chai_1.assert(warningStub.calledOnce);
        });
    });
    describe('from', function () {
        it('should not warn if attempting to form a terminating then non-terminating Link', function () {
            link_1.ApolloLink.from([
                function (operation, forward) { return forward(operation); },
                function (operation) { return zen_observable_ts_1.default.of({ data: data }); },
            ]);
            chai_1.assert(warningStub.notCalled);
        });
        it('should warn if attempting to add link after termination', function () {
            link_1.ApolloLink.from([
                function (operation, forward) { return forward(operation); },
                function (operation) { return zen_observable_ts_1.default.of({ data: data }); },
                function (operation, forward) { return forward(operation); },
            ]);
            chai_1.assert(warningStub.calledOnce);
        });
        it('should warn if attempting to add link after termination', function () {
            link_1.ApolloLink.from([
                function (operation, forward) { return forward(operation); },
                function (operation) { return zen_observable_ts_1.default.of({ data: data }); },
                function (operation, forward) { return forward(operation); },
            ]);
            chai_1.assert(warningStub.calledOnce);
        });
    });
    describe('warning', function () {
        it('should include link that terminates', function () {
            var terminatingLink = new test_utils_1.MockLink(function (operation) {
                return zen_observable_ts_1.default.of({ data: data });
            });
            link_1.ApolloLink.from([
                function (operation, forward) { return forward(operation); },
                function (operation, forward) { return forward(operation); },
                terminatingLink,
                function (operation, forward) { return forward(operation); },
                function (operation, forward) { return forward(operation); },
                function (operation) { return zen_observable_ts_1.default.of({ data: data }); },
                function (operation, forward) { return forward(operation); },
            ]);
            chai_1.assert(warningStub.called);
        });
    });
});
//# sourceMappingURL=link.js.map