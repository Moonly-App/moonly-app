'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SchemaReport = exports.StatsReport = exports.Type = exports.Field = exports.TracesReport = exports.StatsPerSignature = exports.TypeStat = exports.FieldStat = exports.StatsPerClientName = exports.ReportHeader = exports.Trace = exports.Error = exports.Timestamp = exports.Id128 = undefined;

var _protobufjsNoCli = require('protobufjs-no-cli');

// Copied and pasted from https://github.com/apollostack/optics-agent
// instead of using a separate file so we can load w/o doing async I/O
// at startup. This could be done with a babel plugin at compile time
// instead.
//
// XXX As noted in
// https://github.com/apollostack/optics-agent-js/issues/55 simply
// doing `readFileSync` may be the same performance as require and
// easier to implement than doing it at compile time.
var protoBuilder = (0, _protobufjsNoCli.loadProto)('\n// reports 0.6.2016.10.11.1\n// from https://github.com/apollostack/optics-agent\n//\n// Copyright (c) 2016 Meteor Development Group, Inc.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the "Software"), to deal\n// in the Software without restriction, including without limitation the rights\n// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n// copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in all\n// copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n// SOFTWARE.\n\nsyntax = "proto3";\n\nimport "google/protobuf/descriptor.proto";\n\npackage apollo.optics.proto;\n\noption optimize_for = SPEED;\n\nextend google.protobuf.FieldOptions {\n\t// Used for documentation purposes only, as protobuf 3 does not support any indication of required/optional.\n\t// Unless a field is annotated with [(optional)=true], expect that a correct value is required.\n\tbool optional = 50000;\n}\n\nmessage Id128 {\n\tsfixed64 high = 1 [(optional)=false];\n\tsfixed64 low = 2 [(optional)=false];\n}\n\nmessage Timestamp {\n\t// Represents seconds of UTC time since Unix epoch\n\t// 1970-01-01T00:00:00Z. Must be from from 0001-01-01T00:00:00Z to\n\t// 9999-12-31T23:59:59Z inclusive.\n\tint64 seconds = 1 [(optional)=false];\n\n\t// Non-negative fractions of a second at nanosecond resolution. Negative\n\t// second values with fractions must still have non-negative nanos values\n\t// that count forward in time. Must be from 0 to 999,999,999\n\t// inclusive.\n\tint32 nanos = 2 [(optional)=false];\n}\n\nmessage Error {\n\tstring message = 1 [(optional)=false];\n}\n\nmessage Trace {\n\tmessage Details {\n\t\tmap<string, bytes> variables = 1 [(optional)=true];\n\t\tstring raw_query = 2 [(optional)=true];\n\t\tstring operation_name = 3 [(optional)=true];\n\t}\n\n\tmessage HTTPInfo {\n\t\tenum Method {\n\t\t\tUNKNOWN = 0;\n\t\t\tOPTIONS = 1;\n\t\t\tGET = 2;\n\t\t\tHEAD = 3;\n\t\t\tPOST = 4;\n\t\t\tPUT = 5;\n\t\t\tDELETE = 6;\n\t\t\tTRACE = 7;\n\t\t\tCONNECT = 8;\n\t\t\tPATCH = 9;\n\t\t}\n\t\tMethod method = 1 [(optional)=true];\n\t\tstring host = 2 [(optional)=true];\n\t\tstring path = 3 [(optional)=true];\n\n\t\t// Should exclude manual blacklist ("Auth" by default)\n\t\tmap<string, string> headers = 4 [(optional)=true];\n\n\t\tbool secure = 8 [(optional)=true]; // TLS was used\n\t\tstring protocol = 9 [(optional)=true]; // by convention "HTTP/1.0", "HTTP/1.1" or "h2"\n\t}\n\n\tmessage Node {\n\t\toneof id {\n\t\t\tstring field_name = 1;\n\t\t\tuint32 index = 2;\n\t\t}\n\n\t\tstring type = 3 [(optional)=true];\n\t\tstring alias = 4 [(optional)=true];\n\n\t\t// relative to the trace\'s start_time, in ns\n\t\tuint64 start_time = 8 [(optional)=false];\n\t\tuint64 end_time = 9 [(optional)=true];\n\n\t\trepeated Error error = 11 [(optional)=true];\n\t\trepeated Node child = 12 [(optional)=false];\n\t}\n\n\tId128 server_id = 1 [(optional)=false];\n\tId128 client_id = 2 [(optional)=true];\n\n\tTimestamp start_time = 4 [(optional)=false];\n\tTimestamp end_time = 3 [(optional)=false];\n\tuint64 duration_ns = 11 [(optional)=false];\n\n\t// Parsed, filtered for op (incl. fragments), reserialized\n\tstring signature = 5 [(optional)=false]; // see docs/signatures.md\n\n\tDetails details = 6 [(optional)=true];\n\n\tstring client_name = 7 [(optional)=false];\n\tstring client_version = 8 [(optional)=false];\n\tstring client_address = 9 [(optional)=false];\n\n\tHTTPInfo http = 10 [(optional)=true];\n\n\tNode parse = 12 [(optional)=true];\n\tNode validate = 13 [(optional)=true];\n\tNode execute = 14 [(optional)=false];\n}\n\nmessage ReportHeader {\n\tstring service = 3 [(optional)=true];\n\t// eg "host-01.example.com"\n\tstring hostname = 5 [(optional)=true];\n\n\t// eg "optics-agent-js 0.1.0"\n\tstring agent_version = 6 [(optional)=false];\n\t// eg "prod-4279-20160804T065423Z-5-g3cf0aa8" (taken from \'git describe --tags\')\n\tstring service_version = 7 [(optional)=true];\n\t// eg "node v4.6.0"\n\tstring runtime_version = 8 [(optional)=true];\n\t// eg "Linux box 4.6.5-1-ec2 #1 SMP Mon Aug 1 02:31:38 PDT 2016 x86_64 GNU/Linux"\n\tstring uname = 9 [(optional)=true];\n}\n\nmessage StatsPerClientName {\n\trepeated uint64 latency_count = 1 [(optional)=true]; // Duration histogram; see docs/histograms.md\n\trepeated uint64 error_count = 2 [(optional)=true]; // Error histogram; see docs/histograms.md\n\tmap<string, uint64> count_per_version = 3 [(optional)=false];\n}\n\nmessage FieldStat {\n\tstring name = 2 [(optional)=false]; // eg "email" for User.email:String!\n\tstring returnType = 3 [(optional)=false]; // eg "String!" for User.email:String!\n\trepeated uint64 latency_count = 8 [(optional)=true]; // Duration histogram; see docs/histograms.md\n}\n\nmessage TypeStat {\n\tstring name = 1 [(optional)=false]; // eg "User" for User.email:String!\n\trepeated FieldStat field = 2 [(optional)=true];\n}\n\nmessage StatsPerSignature {\n\tmap<string, StatsPerClientName> per_client_name = 1 [(optional)=false];\n\trepeated TypeStat per_type = 2 [(optional)=false];\n}\n\n// Top-level message type for the server-side traces endpoint\nmessage TracesReport {\n\tReportHeader header = 1 [(optional)=false];\n\trepeated Trace trace = 2 [(optional)=false];\n}\n\nmessage Field {\n\tstring name = 2 [(optional)=false]; // eg "email" for User.email:String!\n\tstring returnType = 3 [(optional)=false]; // eg "String!" for User.email:String!\n}\n\nmessage Type {\n\tstring name = 1 [(optional)=false]; // eg "User" for User.email:String!\n\trepeated Field field = 2 [(optional)=true];\n}\n\n// Top-level message type for the server-side stats endpoint\nmessage StatsReport {\n\tReportHeader header = 1 [(optional)=false];\n\n\tTimestamp start_time = 8 [(optional)=false];\n\tTimestamp end_time = 9 [(optional)=false];\n\tuint64 realtime_duration = 10 [(optional)=true];\n\n\tmap<string, StatsPerSignature> per_signature = 12 [(optional)=false];\n\trepeated Type type = 13 [(optional)=true];\n}\n\nmessage SchemaReport {\n\tReportHeader header = 1 [(optional)=false];\n\tstring introspection_result = 8 [(optional)=true];\n\trepeated Type type = 9 [(optional)=true];\n}\n', null, 'reports.proto');

// export top level types

/* eslint-disable no-tabs */

// This file contains the protobuf description for the reports sent to
// the server. It exports JavaScript classes for each top-level type
// in the proto file.

function ns(name) {
	return 'apollo.optics.proto.' + name;
}

var Id128 = exports.Id128 = protoBuilder.build(ns('Id128'));
var Timestamp = exports.Timestamp = protoBuilder.build(ns('Timestamp'));
var Error = exports.Error = protoBuilder.build(ns('Error'));

var Trace = exports.Trace = protoBuilder.build(ns('Trace'));
var ReportHeader = exports.ReportHeader = protoBuilder.build(ns('ReportHeader'));
var StatsPerClientName = exports.StatsPerClientName = protoBuilder.build(ns('StatsPerClientName'));
var FieldStat = exports.FieldStat = protoBuilder.build(ns('FieldStat'));
var TypeStat = exports.TypeStat = protoBuilder.build(ns('TypeStat'));
var StatsPerSignature = exports.StatsPerSignature = protoBuilder.build(ns('StatsPerSignature'));

var TracesReport = exports.TracesReport = protoBuilder.build(ns('TracesReport'));

var Field = exports.Field = protoBuilder.build(ns('Field'));
var Type = exports.Type = protoBuilder.build(ns('Type'));

var StatsReport = exports.StatsReport = protoBuilder.build(ns('StatsReport'));
var SchemaReport = exports.SchemaReport = protoBuilder.build(ns('SchemaReport'));