var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Component, createElement } from 'react';
import * as PropTypes from 'prop-types';
var pick = require('lodash.pick');
import shallowEqual from './shallowEqual';
var invariant = require('invariant');
var assign = require('object-assign');
var hoistNonReactStatics = require('hoist-non-react-statics');
import { parser, DocumentType } from './parser';
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
export default function graphql(document, operationOptions) {
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
            __extends(GraphQL, _super);
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
                invariant(!!this.client, "Could not find \"client\" in the context of " +
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
                    invariant(typeof props[variable.name.value] !== 'undefined', "The operation '" + operation.name + "' wrapping '" + getDisplayName(WrappedComponent) + "' " +
                        ("is expecting a variable: '" + variable.name
                            .value + "' but it was not found in the props ") +
                        ("passed to '" + graphQLDisplayName + "'"));
                }
                opts = __assign({}, opts, { variables: variables });
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
                    invariant(clashingKeys.length === 0, "the result of the '" + graphQLDisplayName + "' operation contains keys that " +
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
                invariant(operationOptions.withRef, "To access the wrapped instance, you need to specify " +
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
                        return createElement(WrappedComponent, assign({}, this.props, { ref: this.setWrappedInstance }));
                    }
                    return createElement(WrappedComponent, this.props);
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
                this.renderedElement = createElement(WrappedComponent, mergedPropsAndData);
                return this.renderedElement;
            };
            GraphQL.displayName = graphQLDisplayName;
            GraphQL.WrappedComponent = WrappedComponent;
            GraphQL.contextTypes = {
                client: PropTypes.object,
                getQueryRecycler: PropTypes.func,
            };
            return GraphQL;
        }(Component));
        return hoistNonReactStatics(GraphQL, WrappedComponent, {});
    }
    return wrapWithApolloComponent;
}
//# sourceMappingURL=graphql.js.map