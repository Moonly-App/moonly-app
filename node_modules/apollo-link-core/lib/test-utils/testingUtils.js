"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var Links = require("../link");
var sampleQuery = "\nquery SampleQuery {\n  stub{\n    id\n  }\n}\n";
function checkCalls(calls, results) {
    chai_1.assert.deepEqual(calls.length, results.length);
    calls.map(function (call, i) { return chai_1.assert.deepEqual(call.args[0].data, results[i]); });
}
exports.checkCalls = checkCalls;
function testLinkResults(params) {
    var link = params.link, context = params.context, variables = params.variables;
    var results = params.results || [];
    var query = params.query || sampleQuery;
    var done = params.done || (function () { return void 0; });
    var spy = sinon.spy();
    Links.execute(link, { query: query, context: context, variables: variables }).subscribe({
        next: spy,
        error: function (error) {
            chai_1.assert(error, results.pop());
            checkCalls(spy.getCalls(), results);
            if (done) {
                done();
            }
        },
        complete: function () {
            checkCalls(spy.getCalls(), results);
            if (done) {
                done();
            }
        },
    });
}
exports.testLinkResults = testLinkResults;
//# sourceMappingURL=testingUtils.js.map