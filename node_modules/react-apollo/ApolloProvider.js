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
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Component } from 'react';
import QueryRecyclerProvider from './QueryRecyclerProvider';
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
}(Component));
export default ApolloProvider;
//# sourceMappingURL=ApolloProvider.js.map