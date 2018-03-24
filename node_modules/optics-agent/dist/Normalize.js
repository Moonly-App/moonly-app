'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trimLatencyBuckets = exports.addLatencyToBuckets = exports.newLatencyBuckets = exports.latencyBucket = exports.normalizeVersion = exports.printType = exports.normalizeQuery = undefined;

var _type = require('graphql/type');

var _separateOperations = require('./separateOperations');

var _normalizedPrinter = require('./normalizedPrinter');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // This file contains helper functions to format or normalize data.

//  //////// GraphQL ////////

// Take a graphql query object and output the "query shape". See
// https://github.com/apollostack/optics-agent/blob/master/docs/signatures.md
// for details.
var normalizeQuery = exports.normalizeQuery = function normalizeQuery(info) {
  var doc = {
    kind: 'Document',
    definitions: [info.operation].concat(_toConsumableArray(Object.keys(info.fragments).map(function (k) {
      return info.fragments[k];
    })))
  };

  var prunedAST = (0, _separateOperations.separateOperations)(doc)[(0, _separateOperations.opName)(info.operation)];

  return (0, _normalizedPrinter.print)(prunedAST);
};

// Turn a graphql type into a user-friendly string. eg 'String' or '[Person!]'
var printType = exports.printType = function printType(type) {
  if (type instanceof _type.GraphQLList) {
    return '[' + printType(type.ofType) + ']';
  } else if (type instanceof _type.GraphQLNonNull) {
    return printType(type.ofType) + '!';
  }
  return type.name;
};

//  //////// Client Type ////////

// Takes a Node HTTP Request object (http.IncomingMessage) and returns
// an object with fields `client_name` and `client_version`.
//
// XXX implement https://github.com/apollostack/optics-agent-js/issues/1
var normalizeVersion = exports.normalizeVersion = function normalizeVersion(_req) {
  return { client_name: 'none', client_version: 'nope' };
};

//  //////// Latency Histograms ////////

// Takes a duration in nanoseconds and returns a integer between 0 and
// 255 (inclusive) to be used as an array offset in a list of buckets.
//
// See https://github.com/apollostack/optics-agent/blob/master/docs/histograms.md
// for details of the algorithm.
var latencyBucket = exports.latencyBucket = function latencyBucket(nanos) {
  var micros = nanos / 1000;

  var bucket = Math.log(micros) / Math.log(1.1);
  if (bucket <= 0) {
    return 0;
  }
  if (bucket >= 255) {
    return 255;
  }
  return Math.ceil(bucket);
};

// Return 256 zeros. A little ugly, but probably easy for compiler to
// optimize at least.
var newLatencyBuckets = exports.newLatencyBuckets = function newLatencyBuckets() {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
};

// Takes a bucket list returned by `newLatencyBuckets` and a duration
// in nanoseconds and adds 1 to the bucket corresponding to the
// duration.
var addLatencyToBuckets = exports.addLatencyToBuckets = function addLatencyToBuckets(buckets, nanos) {
  buckets[latencyBucket(nanos)] += 1; // eslint-disable-line no-param-reassign
};

// Returns a copy of the latency bucket list suitable for sending to
// the server. Currently this is just trimming trailing zeros but it
// could later be a more compact encoding.
var trimLatencyBuckets = exports.trimLatencyBuckets = function trimLatencyBuckets(buckets) {
  var max = buckets.length;
  while (max > 0 && buckets[max - 1] === 0) {
    max -= 1;
  }
  return buckets.slice(0, max);
};