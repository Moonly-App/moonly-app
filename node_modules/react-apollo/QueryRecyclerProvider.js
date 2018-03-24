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
import { Component, Children } from 'react';
import * as PropTypes from 'prop-types';
import { ObservableQueryRecycler } from './queryRecycler';
var QueryRecyclerProvider = (function (_super) {
    __extends(QueryRecyclerProvider, _super);
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
        return Children.only(this.props.children);
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
}(Component));
export default QueryRecyclerProvider;
//# sourceMappingURL=QueryRecyclerProvider.js.map