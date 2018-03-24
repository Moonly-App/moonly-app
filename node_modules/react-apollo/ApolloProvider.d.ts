/// <reference types="react" />
import { Component } from 'react';
import { Store } from 'redux';
import ApolloClient from 'apollo-client';
export interface ProviderProps {
    store?: Store<any>;
    client: ApolloClient;
}
export default class ApolloProvider extends Component<ProviderProps, any> {
    static propTypes: {
        store: any;
        client: any;
        children: any;
    };
    static childContextTypes: {
        store: any;
        client: any;
    };
    static contextTypes: {
        store: any;
    };
    constructor(props: any, context: any);
    componentWillReceiveProps(nextProps: any): void;
    getChildContext(): {
        store: any;
        client: ApolloClient;
    };
    render(): JSX.Element;
}
