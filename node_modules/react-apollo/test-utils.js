(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('apollo-client'), require('graphql'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'apollo-client', 'graphql', 'prop-types'], factory) :
	(factory((global['react-apollo'] = {}),global.React,global.ApolloClient,global.graphql,global.PropTypes));
}(this, (function (exports,React,ApolloClient,graphql,PropTypes) { 'use strict';

ApolloClient = ApolloClient && ApolloClient.hasOwnProperty('default') ? ApolloClient['default'] : ApolloClient;

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var ObservableQueryRecycler = (function () {
    function ObservableQueryRecycler() {
        this.observableQueries = [];
    }
    ObservableQueryRecycler.prototype.recycle = function (observableQuery) {
        observableQuery.setOptions({
            fetchPolicy: 'standby',
            pollInterval: 0,
            fetchResults: false,
        });
        this.observableQueries.push({
            observableQuery: observableQuery,
            subscription: observableQuery.subscribe({}),
        });
    };
    ObservableQueryRecycler.prototype.reuse = function (options) {
        if (this.observableQueries.length <= 0) {
            return null;
        }
        var _a = this.observableQueries.pop(), observableQuery = _a.observableQuery, subscription = _a.subscription;
        subscription.unsubscribe();
        var ssr = options.ssr, skip = options.skip, client = options.client, modifiableOpts = __rest(options, ["ssr", "skip", "client"]);
        observableQuery.setOptions(__assign({}, modifiableOpts, { pollInterval: options.pollInterval, fetchPolicy: options.fetchPolicy }));
        return observableQuery;
    };
    return ObservableQueryRecycler;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var QueryRecyclerProvider = (function (_super) {
    __extends$2(QueryRecyclerProvider, _super);
    function QueryRecyclerProvider(props) {
        var _this = _super.call(this, props) || this;
        _this.recyclers = new WeakMap();
        _this.getQueryRecycler = _this.getQueryRecycler.bind(_this);
        return _this;
    }
    QueryRecyclerProvider.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
        if (this.context.client !== nextContext.client) {
            this.recyclers = new WeakMap();
        }
    };
    QueryRecyclerProvider.prototype.getQueryRecycler = function (component) {
        if (!this.recyclers.has(component)) {
            this.recyclers.set(component, new ObservableQueryRecycler());
        }
        return this.recyclers.get(component);
    };
    QueryRecyclerProvider.prototype.getChildContext = function () {
        return ({
            getQueryRecycler: this.getQueryRecycler
        });
    };
    QueryRecyclerProvider.prototype.render = function () {
        return React.Children.only(this.props.children);
    };
    QueryRecyclerProvider.propTypes = {
        children: PropTypes.element.isRequired
    };
    QueryRecyclerProvider.contextTypes = {
        client: PropTypes.object
    };
    QueryRecyclerProvider.childContextTypes = {
        getQueryRecycler: PropTypes.func.isRequired
    };
    return QueryRecyclerProvider;
}(React.Component));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var invariant = require('invariant');
var ApolloProvider = (function (_super) {
    __extends$1(ApolloProvider, _super);
    function ApolloProvider(props, context) {
        var _this = _super.call(this, props, context) || this;
        invariant(props.client, 'ApolloClient was not passed a client instance. Make ' +
            'sure you pass in your client via the "client" prop.');
        if (!props.store && typeof props.client.initStore === 'function') {
            props.client.initStore();
        }
        return _this;
    }
    ApolloProvider.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.client !== this.props.client &&
            !nextProps.store &&
            typeof nextProps.client.initStore === 'function') {
            nextProps.client.initStore();
        }
    };
    ApolloProvider.prototype.getChildContext = function () {
        return {
            store: this.props.store || this.context.store,
            client: this.props.client,
        };
    };
    ApolloProvider.prototype.render = function () {
        return (React.createElement(QueryRecyclerProvider, null, React.Children.only(this.props.children)));
    };
    ApolloProvider.propTypes = {
        store: PropTypes.shape({
            subscribe: PropTypes.func.isRequired,
            dispatch: PropTypes.func.isRequired,
            getState: PropTypes.func.isRequired,
        }),
        client: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired,
    };
    ApolloProvider.childContextTypes = {
        store: PropTypes.object,
        client: PropTypes.object.isRequired,
    };
    ApolloProvider.contextTypes = {
        store: PropTypes.object,
    };
    return ApolloProvider;
}(React.Component));

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MockedProvider = (function (_super) {
    __extends(MockedProvider, _super);
    function MockedProvider(props, context) {
        var _this = _super.call(this, props, context) || this;
        if (_this.props.client)
            return _this;
        var addTypename = !_this.props.removeTypename;
        var networkInterface = mockNetworkInterface.apply(null, _this.props.mocks);
        _this.client = new ApolloClient({ networkInterface: networkInterface, addTypename: addTypename });
        return _this;
    }
    MockedProvider.prototype.render = function () {
        return (React.createElement(ApolloProvider, { client: this.client || this.props.client, store: this.props.store || null }, this.props.children));
    };
    return MockedProvider;
}(React.Component));
var MockedSubscriptionProvider = (function (_super) {
    __extends(MockedSubscriptionProvider, _super);
    function MockedSubscriptionProvider(props, context) {
        var _this = _super.call(this, props, context) || this;
        var networkInterface = mockSubscriptionNetworkInterface.apply(void 0, [_this.props.subscriptions].concat(_this.props.responses));
        _this.client = new ApolloClient({ networkInterface: networkInterface });
        return _this;
    }
    MockedSubscriptionProvider.prototype.render = function () {
        return (React.createElement(ApolloProvider, { client: this.client }, this.props.children));
    };
    return MockedSubscriptionProvider;
}(React.Component));
function mockNetworkInterface() {
    var mockedResponses = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mockedResponses[_i] = arguments[_i];
    }
    return new (MockNetworkInterface.bind.apply(MockNetworkInterface, [void 0].concat(mockedResponses)))();
}
function mockSubscriptionNetworkInterface(mockedSubscriptions) {
    var mockedResponses = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        mockedResponses[_i - 1] = arguments[_i];
    }
    return new (MockSubscriptionNetworkInterface.bind.apply(MockSubscriptionNetworkInterface, [void 0, mockedSubscriptions].concat(mockedResponses)))();
}
var MockNetworkInterface = (function () {
    function MockNetworkInterface() {
        var mockedResponses = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            mockedResponses[_i] = arguments[_i];
        }
        var _this = this;
        this.mockedResponsesByKey = {};
        mockedResponses.forEach(function (mockedResponse) {
            if (!mockedResponse.result && !mockedResponse.error) {
                throw new Error('Mocked response should contain either result or error.');
            }
            _this.addMockedResponse(mockedResponse);
        });
    }
    MockNetworkInterface.prototype.addMockedResponse = function (mockedResponse) {
        var key = requestToKey(mockedResponse.request);
        var mockedResponses = this.mockedResponsesByKey[key];
        if (!mockedResponses) {
            mockedResponses = [];
            this.mockedResponsesByKey[key] = mockedResponses;
        }
        mockedResponses.push(mockedResponse);
    };
    MockNetworkInterface.prototype.query = function (request) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var parsedRequest = {
                query: request.query,
                variables: request.variables,
                debugName: request.debugName,
            };
            var key = requestToKey(parsedRequest);
            if (!_this.mockedResponsesByKey[key] ||
                _this.mockedResponsesByKey[key].length === 0) {
                throw new Error('No more mocked responses for the query: ' + graphql.print(request.query));
            }
            var original = _this.mockedResponsesByKey[key].slice();
            var _a = _this.mockedResponsesByKey[key].shift() || {}, result = _a.result, error = _a.error, delay = _a.delay, newData = _a.newData;
            if (newData) {
                original[0].result = newData();
                _this.mockedResponsesByKey[key].push(original[0]);
            }
            if (!result && !error) {
                throw new Error("Mocked response should contain either result or error: " + key);
            }
            setTimeout(function () {
                if (error)
                    return reject(error);
                return resolve(result);
            }, delay ? delay : 1);
        });
    };
    return MockNetworkInterface;
}());
var MockSubscriptionNetworkInterface = (function (_super) {
    __extends(MockSubscriptionNetworkInterface, _super);
    function MockSubscriptionNetworkInterface(mockedSubscriptions) {
        var mockedResponses = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            mockedResponses[_i - 1] = arguments[_i];
        }
        var _this = _super.apply(this, mockedResponses) || this;
        _this.mockedSubscriptionsByKey = {};
        _this.mockedSubscriptionsById = {};
        _this.handlersById = {};
        _this.subId = 0;
        mockedSubscriptions.forEach(function (sub) {
            _this.addMockedSubscription(sub);
        });
        return _this;
    }
    MockSubscriptionNetworkInterface.prototype.generateSubscriptionId = function () {
        var requestId = this.subId;
        this.subId++;
        return requestId;
    };
    MockSubscriptionNetworkInterface.prototype.addMockedSubscription = function (mockedSubscription) {
        var key = requestToKey(mockedSubscription.request);
        if (mockedSubscription.id === undefined) {
            mockedSubscription.id = this.generateSubscriptionId();
        }
        var mockedSubs = this.mockedSubscriptionsByKey[key];
        if (!mockedSubs) {
            mockedSubs = [];
            this.mockedSubscriptionsByKey[key] = mockedSubs;
        }
        mockedSubs.push(mockedSubscription);
    };
    MockSubscriptionNetworkInterface.prototype.subscribe = function (request, handler) {
        var parsedRequest = {
            query: request.query,
            variables: request.variables,
            debugName: request.debugName,
        };
        var key = requestToKey(parsedRequest);
        if (this.mockedSubscriptionsByKey.hasOwnProperty(key)) {
            var subscription = this.mockedSubscriptionsByKey[key].shift();
            this.handlersById[subscription.id] = handler;
            this.mockedSubscriptionsById[subscription.id] = subscription;
            return subscription.id;
        }
        else {
            throw new Error('Network interface does not have subscription associated with this request.');
        }
    };
    MockSubscriptionNetworkInterface.prototype.fireResult = function (id) {
        var handler = this.handlersById[id];
        if (this.mockedSubscriptionsById.hasOwnProperty(id.toString())) {
            var subscription = this.mockedSubscriptionsById[id];
            if (subscription.results.length === 0) {
                throw new Error("No more mocked subscription responses for the query: " +
                    (graphql.print(subscription.request.query) + ", variables: " + JSON.stringify(subscription.request.variables)));
            }
            var response_1 = subscription.results.shift();
            setTimeout(function () {
                handler(response_1.error, response_1.result);
            }, response_1.delay ? response_1.delay : 0);
        }
        else {
            throw new Error('Network interface does not have subscription associated with this id.');
        }
    };
    MockSubscriptionNetworkInterface.prototype.unsubscribe = function (id) {
        delete this.mockedSubscriptionsById[id];
    };
    return MockSubscriptionNetworkInterface;
}(MockNetworkInterface));
function requestToKey(request) {
    var queryString = request.query && graphql.print(request.query);
    var requestKey = {
        variables: request.variables || {},
        debugName: request.debugName,
        query: queryString,
    };
    return JSON.stringify(requestKey, Object.keys(requestKey).sort());
}

exports.MockedProvider = MockedProvider;
exports.MockedSubscriptionProvider = MockedSubscriptionProvider;
exports.mockNetworkInterface = mockNetworkInterface;
exports.mockSubscriptionNetworkInterface = mockSubscriptionNetworkInterface;
exports.MockNetworkInterface = MockNetworkInterface;
exports.MockSubscriptionNetworkInterface = MockSubscriptionNetworkInterface;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=test-utils.js.map
