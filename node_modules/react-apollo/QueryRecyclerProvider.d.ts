/// <reference types="react" />
import { Component } from 'react';
import { ObservableQueryRecycler } from './queryRecycler';
declare class QueryRecyclerProvider extends Component {
    static propTypes: {
        children: any;
    };
    static contextTypes: {
        client: any;
    };
    static childContextTypes: {
        getQueryRecycler: any;
    };
    private recyclers;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any, nextContext: any): void;
    getQueryRecycler(component: any): ObservableQueryRecycler;
    getChildContext(): {
        getQueryRecycler: (component: any) => ObservableQueryRecycler;
    };
    render(): React.ReactElement<any>;
}
export default QueryRecyclerProvider;
