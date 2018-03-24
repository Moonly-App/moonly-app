(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types'), require('redux'), require('apollo-client'), require('graphql-tag'), require('react-dom/server')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types', 'redux', 'apollo-client', 'graphql-tag', 'react-dom/server'], factory) :
	(factory((global['react-apollo'] = {}),global.React,global.PropTypes,global.redux,global.apolloClient,global.graphqlTag,global.ReactDOM));
}(this, (function (exports,React,PropTypes,redux,apolloClient,graphqlTag,ReactDOM) { 'use strict';

graphqlTag = graphqlTag && graphqlTag.hasOwnProperty('default') ? graphqlTag['default'] : graphqlTag;

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
var QueryRecyclerProvider = (function (_super) {
    __extends$1(QueryRecyclerProvider, _super);
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
var invariant = require('invariant');
var ApolloProvider = (function (_super) {
    __extends(ApolloProvider, _super);
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

function shallowEqual(objA, objB) {
    if (!objA || !objB)
        return false;
    if (objA === objB)
        return true;
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length)
        return false;
    var hasOwn = Object.prototype.hasOwnProperty;
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
        }
    }
    return true;
}

var invariant$2 = require('invariant');
var DocumentType;
(function (DocumentType) {
    DocumentType[DocumentType["Query"] = 0] = "Query";
    DocumentType[DocumentType["Mutation"] = 1] = "Mutation";
    DocumentType[DocumentType["Subscription"] = 2] = "Subscription";
})(DocumentType || (DocumentType = {}));
function parser(document) {
    var variables, type, name;
    invariant$2(!!document && !!document.kind, "Argument of " + document + " passed to parser was not a valid GraphQL DocumentNode. You may need to use 'graphql-tag' or another method to convert your operation into a document");
    var fragments = document.definitions.filter(function (x) { return x.kind === 'FragmentDefinition'; });
    var queries = document.definitions.filter(function (x) {
        return x.kind === 'OperationDefinition' && x.operation === 'query';
    });
    var mutations = document.definitions.filter(function (x) {
        return x.kind === 'OperationDefinition' && x.operation === 'mutation';
    });
    var subscriptions = document.definitions.filter(function (x) {
        return x.kind === 'OperationDefinition' && x.operation === 'subscription';
    });
    invariant$2(!fragments.length ||
        (queries.length || mutations.length || subscriptions.length), "Passing only a fragment to 'graphql' is not yet supported. You must include a query, subscription or mutation as well");
    invariant$2(queries.length + mutations.length + subscriptions.length <= 1, "react-apollo only supports a query, subscription, or a mutation per HOC. " + document + " had " + queries.length + " queries, " + subscriptions.length + " subscriptions and " + mutations.length + " mutations. You can use 'compose' to join multiple operation types to a component");
    type = queries.length ? DocumentType.Query : DocumentType.Mutation;
    if (!queries.length && !mutations.length)
        type = DocumentType.Subscription;
    var definitions = queries.length
        ? queries
        : mutations.length ? mutations : subscriptions;
    invariant$2(definitions.length === 1, "react-apollo only supports one defintion per HOC. " + document + " had " + definitions.length + " definitions. You can use 'compose' to join multiple operation types to a component");
    var definition = definitions[0];
    variables = definition.variableDefinitions || [];
    var hasName = definition.name && definition.name.kind === 'Name';
    name = hasName ? definition.name.value : 'data';
    return { name: name, type: type, variables: variables };
}

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
var __assign$1 = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var pick = require('lodash.pick');
var invariant$1 = require('invariant');
var assign = require('object-assign');
var hoistNonReactStatics = require('hoist-non-react-statics');
var defaultMapPropsToOptions = function (props) { return ({}); };
var defaultMapResultToProps = function (props) { return props; };
var defaultMapPropsToSkip = function (props) { return false; };
function observableQueryFields(observable) {
    var fields = pick(observable, 'variables', 'refetch', 'fetchMore', 'updateQuery', 'startPolling', 'stopPolling', 'subscribeToMore');
    Object.keys(fields).forEach(function (key) {
        if (typeof fields[key] === 'function') {
            fields[key] = fields[key].bind(observable);
        }
    });
    return fields;
}
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
var nextVersion = 0;
function graphql(document, operationOptions) {
    if (operationOptions === void 0) { operationOptions = {}; }
    var _a = operationOptions.options, options = _a === void 0 ? defaultMapPropsToOptions : _a, _b = operationOptions.skip, skip = _b === void 0 ? defaultMapPropsToSkip : _b, _c = operationOptions.alias, alias = _c === void 0 ? 'Apollo' : _c;
    var mapPropsToOptions = options;
    if (typeof mapPropsToOptions !== 'function')
        mapPropsToOptions = function () { return options; };
    var mapPropsToSkip = skip;
    if (typeof mapPropsToSkip !== 'function')
        mapPropsToSkip = function () { return skip; };
    var mapResultToProps = operationOptions.props;
    var operation = parser(document);
    var version = nextVersion++;
    function wrapWithApolloComponent(WrappedComponent) {
        var graphQLDisplayName = alias + "(" + getDisplayName(WrappedComponent) + ")";
        var GraphQL = (function (_super) {
            __extends$2(GraphQL, _super);
            function GraphQL(props, context) {
                var _this = _super.call(this, props, context) || this;
                _this.previousData = {};
                _this.version = version;
                _this.type = operation.type;
                _this.dataForChildViaMutation = _this.dataForChildViaMutation.bind(_this);
                _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);
                return _this;
            }
            GraphQL.prototype.componentWillMount = function () {
                if (!this.shouldSkip(this.props)) {
                    this.setInitialProps();
                }
            };
            GraphQL.prototype.componentDidMount = function () {
                this.hasMounted = true;
                if (this.type === DocumentType.Mutation)
                    return;
                if (!this.shouldSkip(this.props)) {
                    this.subscribeToQuery();
                    if (this.refetcherQueue) {
                        var _a = this.refetcherQueue, args = _a.args, resolve = _a.resolve, reject = _a.reject;
                        this.queryObservable.refetch(args).then(resolve).catch(reject);
                    }
                }
            };
            GraphQL.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
                var client = mapPropsToOptions(nextProps).client;
                if (shallowEqual(this.props, nextProps) &&
                    (this.client === client || this.client === nextContext.client)) {
                    return;
                }
                this.shouldRerender = true;
                if (this.client !== client && this.client !== nextContext.client) {
                    if (client) {
                        this.client = client;
                    }
                    else {
                        this.client = nextContext.client;
                    }
                    this.unsubscribeFromQuery();
                    this.queryObservable = null;
                    this.previousData = {};
                    this.updateQuery(nextProps);
                    if (!this.shouldSkip(nextProps)) {
                        this.subscribeToQuery();
                    }
                    return;
                }
                if (this.type === DocumentType.Mutation) {
                    return;
                }
                if (this.type === DocumentType.Subscription &&
                    operationOptions.shouldResubscribe &&
                    operationOptions.shouldResubscribe(this.props, nextProps)) {
                    this.unsubscribeFromQuery();
                    delete this.queryObservable;
                    this.updateQuery(nextProps);
                    this.subscribeToQuery();
                    return;
                }
                if (this.shouldSkip(nextProps)) {
                    if (!this.shouldSkip(this.props)) {
                        this.unsubscribeFromQuery();
                    }
                    return;
                }
                this.updateQuery(nextProps);
                this.subscribeToQuery();
            };
            GraphQL.prototype.componentWillUnmount = function () {
                if (this.type === DocumentType.Query) {
                    if (this.queryObservable) {
                        var recycler = this.getQueryRecycler();
                        if (recycler) {
                            recycler.recycle(this.queryObservable);
                            delete this.queryObservable;
                        }
                    }
                    this.unsubscribeFromQuery();
                }
                if (this.type === DocumentType.Subscription)
                    this.unsubscribeFromQuery();
                this.hasMounted = false;
            };
            GraphQL.prototype.getQueryRecycler = function () {
                return (this.context.getQueryRecycler &&
                    this.context.getQueryRecycler(GraphQL));
            };
            GraphQL.prototype.getClient = function (props) {
                if (this.client)
                    return this.client;
                var client = mapPropsToOptions(props).client;
                if (client) {
                    this.client = client;
                }
                else {
                    this.client = this.context.client;
                }
                invariant$1(!!this.client, "Could not find \"client\" in the context of " +
                    ("\"" + graphQLDisplayName + "\". ") +
                    "Wrap the root component in an <ApolloProvider>");
                return this.client;
            };
            GraphQL.prototype.calculateOptions = function (props, newOpts) {
                if (props === void 0) { props = this.props; }
                var opts = mapPropsToOptions(props);
                if (newOpts && newOpts.variables) {
                    newOpts.variables = assign({}, opts.variables, newOpts.variables);
                }
                if (newOpts)
                    opts = assign({}, opts, newOpts);
                if (opts.variables || !operation.variables.length)
                    return opts;
                var variables = {};
                for (var _i = 0, _a = operation.variables; _i < _a.length; _i++) {
                    var _b = _a[_i], variable = _b.variable, type = _b.type;
                    if (!variable.name || !variable.name.value)
                        continue;
                    if (typeof props[variable.name.value] !== 'undefined') {
                        variables[variable.name.value] = props[variable.name.value];
                        continue;
                    }
                    if (type.kind !== 'NonNullType') {
                        variables[variable.name.value] = null;
                        continue;
                    }
                    invariant$1(typeof props[variable.name.value] !== 'undefined', "The operation '" + operation.name + "' wrapping '" + getDisplayName(WrappedComponent) + "' " +
                        ("is expecting a variable: '" + variable.name
                            .value + "' but it was not found in the props ") +
                        ("passed to '" + graphQLDisplayName + "'"));
                }
                opts = __assign$1({}, opts, { variables: variables });
                return opts;
            };
            GraphQL.prototype.calculateResultProps = function (result) {
                var name = this.type === DocumentType.Mutation ? 'mutate' : 'data';
                if (operationOptions.name)
                    name = operationOptions.name;
                var newResult = (_a = {},
                    _a[name] = result,
                    _a.ownProps = this.props,
                    _a);
                if (mapResultToProps)
                    return mapResultToProps(newResult);
                return _b = {}, _b[name] = defaultMapResultToProps(result), _b;
                var _a, _b;
            };
            GraphQL.prototype.setInitialProps = function () {
                if (this.type === DocumentType.Mutation) {
                    return;
                }
                var opts = this.calculateOptions(this.props);
                this.createQuery(opts);
            };
            GraphQL.prototype.createQuery = function (opts, props) {
                if (props === void 0) { props = this.props; }
                if (this.type === DocumentType.Subscription) {
                    this.queryObservable = this.getClient(props).subscribe(assign({
                        query: document,
                    }, opts));
                }
                else {
                    var recycler = this.getQueryRecycler();
                    var queryObservable = null;
                    if (recycler)
                        queryObservable = recycler.reuse(opts);
                    if (queryObservable === null) {
                        this.queryObservable = this.getClient(props).watchQuery(assign({
                            query: document,
                            metadata: {
                                reactComponent: {
                                    displayName: graphQLDisplayName,
                                },
                            },
                        }, opts));
                    }
                    else {
                        this.queryObservable = queryObservable;
                    }
                }
            };
            GraphQL.prototype.updateQuery = function (props) {
                var opts = this.calculateOptions(props);
                if (!this.queryObservable) {
                    this.createQuery(opts, props);
                }
                if (this.queryObservable._setOptionsNoResult) {
                    this.queryObservable._setOptionsNoResult(opts);
                }
                else {
                    if (this.queryObservable.setOptions) {
                        this.queryObservable
                            .setOptions(opts)
                            .catch(function (error) { return null; });
                    }
                }
            };
            GraphQL.prototype.fetchData = function () {
                if (this.shouldSkip())
                    return false;
                if (operation.type === DocumentType.Mutation ||
                    operation.type === DocumentType.Subscription)
                    return false;
                var opts = this.calculateOptions();
                if (opts.ssr === false)
                    return false;
                if (opts.fetchPolicy === 'network-only' ||
                    opts.fetchPolicy === 'cache-and-network') {
                    opts.fetchPolicy = 'cache-first';
                }
                var observable = this.getClient(this.props).watchQuery(assign({ query: document }, opts));
                var result = observable.currentResult();
                if (result.loading) {
                    return observable.result();
                }
                else {
                    return false;
                }
            };
            GraphQL.prototype.subscribeToQuery = function () {
                var _this = this;
                if (this.querySubscription) {
                    return;
                }
                var next = function (results) {
                    if (_this.type === DocumentType.Subscription) {
                        _this.lastSubscriptionData = results;
                        results = { data: results };
                    }
                    var clashingKeys = Object.keys(observableQueryFields(results.data));
                    invariant$1(clashingKeys.length === 0, "the result of the '" + graphQLDisplayName + "' operation contains keys that " +
                        "conflict with the return object." +
                        clashingKeys.map(function (k) { return "'" + k + "'"; }).join(', ') +
                        " not allowed.");
                    _this.forceRenderChildren();
                };
                var handleError = function (error) {
                    if (error.hasOwnProperty('graphQLErrors'))
                        return next({ error: error });
                    throw error;
                };
                this.querySubscription = this.queryObservable.subscribe({
                    next: next,
                    error: handleError,
                });
            };
            GraphQL.prototype.unsubscribeFromQuery = function () {
                if (this.querySubscription) {
                    this.querySubscription.unsubscribe();
                    delete this.querySubscription;
                }
            };
            GraphQL.prototype.shouldSkip = function (props) {
                if (props === void 0) { props = this.props; }
                return (mapPropsToSkip(props) || mapPropsToOptions(props).skip);
            };
            GraphQL.prototype.forceRenderChildren = function () {
                this.shouldRerender = true;
                if (this.hasMounted)
                    this.forceUpdate();
            };
            GraphQL.prototype.getWrappedInstance = function () {
                invariant$1(operationOptions.withRef, "To access the wrapped instance, you need to specify " +
                    "{ withRef: true } in the options");
                return this.wrappedInstance;
            };
            GraphQL.prototype.setWrappedInstance = function (ref) {
                this.wrappedInstance = ref;
            };
            GraphQL.prototype.dataForChildViaMutation = function (mutationOpts) {
                var opts = this.calculateOptions(this.props, mutationOpts);
                if (typeof opts.variables === 'undefined')
                    delete opts.variables;
                opts.mutation = document;
                return this.getClient(this.props).mutate(opts);
            };
            GraphQL.prototype.dataForChild = function () {
                var _this = this;
                if (this.type === DocumentType.Mutation) {
                    return this.dataForChildViaMutation;
                }
                var opts = this.calculateOptions(this.props);
                var data = {};
                assign(data, observableQueryFields(this.queryObservable));
                if (this.type === DocumentType.Subscription) {
                    assign(data, {
                        loading: !this.lastSubscriptionData,
                        variables: opts.variables,
                    }, this.lastSubscriptionData);
                }
                else {
                    var currentResult = this.queryObservable.currentResult();
                    var loading = currentResult.loading, error_1 = currentResult.error, networkStatus = currentResult.networkStatus;
                    assign(data, { loading: loading, networkStatus: networkStatus });
                    var logErrorTimeoutId_1 = setTimeout(function () {
                        if (error_1) {
                            console.error('Unhandled (in react-apollo)', error_1.stack || error_1);
                        }
                    }, 10);
                    Object.defineProperty(data, 'error', {
                        configurable: true,
                        enumerable: true,
                        get: function () {
                            clearTimeout(logErrorTimeoutId_1);
                            return error_1;
                        },
                    });
                    if (loading) {
                        assign(data, this.previousData, currentResult.data);
                    }
                    else if (error_1) {
                        assign(data, (this.queryObservable.getLastResult() || {}).data);
                    }
                    else {
                        assign(data, currentResult.data);
                        this.previousData = currentResult.data;
                    }
                    if (!this.querySubscription) {
                        data.refetch = function (args) {
                            return new Promise(function (r, f) {
                                _this.refetcherQueue = { resolve: r, reject: f, args: args };
                            });
                        };
                    }
                }
                return data;
            };
            GraphQL.prototype.render = function () {
                if (this.shouldSkip()) {
                    if (operationOptions.withRef) {
                        return React.createElement(WrappedComponent, assign({}, this.props, { ref: this.setWrappedInstance }));
                    }
                    return React.createElement(WrappedComponent, this.props);
                }
                var _a = this, shouldRerender = _a.shouldRerender, renderedElement = _a.renderedElement, props = _a.props;
                this.shouldRerender = false;
                if (!shouldRerender &&
                    renderedElement &&
                    renderedElement.type === WrappedComponent) {
                    return renderedElement;
                }
                var data = this.dataForChild();
                var clientProps = this.calculateResultProps(data);
                var mergedPropsAndData = assign({}, props, clientProps);
                if (operationOptions.withRef)
                    mergedPropsAndData.ref = this.setWrappedInstance;
                this.renderedElement = React.createElement(WrappedComponent, mergedPropsAndData);
                return this.renderedElement;
            };
            GraphQL.displayName = graphQLDisplayName;
            GraphQL.WrappedComponent = WrappedComponent;
            GraphQL.contextTypes = {
                client: PropTypes.object,
                getQueryRecycler: PropTypes.func,
            };
            return GraphQL;
        }(React.Component));
        return hoistNonReactStatics(GraphQL, WrappedComponent, {});
    }
    return wrapWithApolloComponent;
}

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var invariant$3 = require('invariant');
var assign$1 = require('object-assign');
var hoistNonReactStatics$1 = require('hoist-non-react-statics');
function getDisplayName$1(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
function withApollo(WrappedComponent, operationOptions) {
    if (operationOptions === void 0) { operationOptions = {}; }
    var withDisplayName = "withApollo(" + getDisplayName$1(WrappedComponent) + ")";
    var WithApollo = (function (_super) {
        __extends$3(WithApollo, _super);
        function WithApollo(props, context) {
            var _this = _super.call(this, props, context) || this;
            _this.client = context.client;
            _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);
            invariant$3(!!_this.client, "Could not find \"client\" in the context of " +
                ("\"" + withDisplayName + "\". ") +
                "Wrap the root component in an <ApolloProvider>");
            return _this;
        }
        WithApollo.prototype.getWrappedInstance = function () {
            invariant$3(operationOptions.withRef, "To access the wrapped instance, you need to specify " +
                "{ withRef: true } in the options");
            return this.wrappedInstance;
        };
        WithApollo.prototype.setWrappedInstance = function (ref) {
            this.wrappedInstance = ref;
        };
        WithApollo.prototype.render = function () {
            var props = assign$1({}, this.props);
            props.client = this.client;
            if (operationOptions.withRef)
                props.ref = this.setWrappedInstance;
            return React.createElement(WrappedComponent, props);
        };
        WithApollo.displayName = withDisplayName;
        WithApollo.WrappedComponent = WrappedComponent;
        WithApollo.contextTypes = { client: PropTypes.object.isRequired };
        return WithApollo;
    }(React.Component));
    return hoistNonReactStatics$1(WithApollo, WrappedComponent, {});
}

var assign$2 = require('object-assign');
function walkTree(element$$1, context, visitor) {
    var Component$$1 = element$$1.type;
    if (typeof Component$$1 === 'function') {
        var props = assign$2({}, Component$$1.defaultProps, element$$1.props);
        var childContext = context;
        var child = void 0;
        if (Component$$1.prototype && Component$$1.prototype.isReactComponent) {
            var _component = Component$$1;
            var instance_1 = new _component(props, context);
            instance_1.props = instance_1.props || props;
            instance_1.context = instance_1.context || context;
            instance_1.setState = function (newState) {
                instance_1.state = assign$2({}, instance_1.state, newState);
            };
            if (instance_1.componentWillMount) {
                instance_1.componentWillMount();
            }
            if (instance_1.getChildContext) {
                childContext = assign$2({}, context, instance_1.getChildContext());
            }
            if (visitor(element$$1, instance_1, context) === false) {
                return;
            }
            child = instance_1.render();
        }
        else {
            if (visitor(element$$1, null, context) === false) {
                return;
            }
            var _component = Component$$1;
            child = _component(props, context);
        }
        if (child) {
            walkTree(child, childContext, visitor);
        }
    }
    else {
        if (visitor(element$$1, null, context) === false) {
            return;
        }
        if (element$$1.props && element$$1.props.children) {
            React.Children.forEach(element$$1.props.children, function (child) {
                if (child) {
                    walkTree(child, context, visitor);
                }
            });
        }
    }
}
function getQueriesFromTree(_a, fetchRoot) {
    var rootElement = _a.rootElement, _b = _a.rootContext, rootContext = _b === void 0 ? {} : _b;
    if (fetchRoot === void 0) { fetchRoot = true; }
    var queries = [];
    walkTree(rootElement, rootContext, function (element$$1, instance, context) {
        var skipRoot = !fetchRoot && element$$1 === rootElement;
        if (instance && typeof instance.fetchData === 'function' && !skipRoot) {
            var query = instance.fetchData();
            if (query) {
                queries.push({ query: query, element: element$$1, context: context });
                return false;
            }
        }
    });
    return queries;
}
function getDataFromTree(rootElement, rootContext, fetchRoot) {
    if (rootContext === void 0) { rootContext = {}; }
    if (fetchRoot === void 0) { fetchRoot = true; }
    var queries = getQueriesFromTree({ rootElement: rootElement, rootContext: rootContext }, fetchRoot);
    if (!queries.length)
        return Promise.resolve();
    var errors = [];
    var mappedQueries = queries.map(function (_a) {
        var query = _a.query, element$$1 = _a.element, context = _a.context;
        return query
            .then(function (_) { return getDataFromTree(element$$1, context, false); })
            .catch(function (e) { return errors.push(e); });
    });
    return Promise.all(mappedQueries).then(function (_) {
        if (errors.length > 0) {
            var error = errors.length === 1
                ? errors[0]
                : new Error(errors.length + " errors were thrown when executing your GraphQL queries.");
            error.queryErrors = errors;
            throw error;
        }
    });
}
function renderToStringWithData(component) {
    return getDataFromTree(component).then(function () {
        return ReactDOM.renderToString(component);
    });
}
function cleanupApolloState(apolloState) {
    for (var queryId in apolloState.queries) {
        var fieldsToNotShip = ['minimizedQuery', 'minimizedQueryString'];
        for (var _i = 0, fieldsToNotShip_1 = fieldsToNotShip; _i < fieldsToNotShip_1.length; _i++) {
            var field = fieldsToNotShip_1[_i];
            delete apolloState.queries[queryId][field];
        }
    }
}

exports.getDataFromTree = getDataFromTree;
exports.renderToStringWithData = renderToStringWithData;
exports.walkTree = walkTree;
exports.cleanupApolloState = cleanupApolloState;
exports.ApolloProvider = ApolloProvider;
exports.graphql = graphql;
exports.withApollo = withApollo;
exports.compose = redux.compose;
exports.gql = graphqlTag;
Object.keys(apolloClient).forEach(function (key) { exports[key] = apolloClient[key]; });

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=react-apollo.umd.js.map
