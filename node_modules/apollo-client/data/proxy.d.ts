import { DocumentNode } from 'graphql';
import { ApolloStore, Store, ApolloReducerConfig } from '../store';
import { DataWrite } from '../actions';
import { NormalizedCache } from '../data/storeUtils';
import { FragmentMatcherInterface } from './fragmentMatcher';
export interface DataProxyReadQueryOptions {
    query: DocumentNode;
    variables?: Object;
}
export interface DataProxyReadFragmentOptions {
    id: string;
    fragment: DocumentNode;
    fragmentName?: string;
    variables?: Object;
}
export interface DataProxyWriteQueryOptions {
    data: any;
    query: DocumentNode;
    variables?: Object;
}
export interface DataProxyWriteFragmentOptions {
    data: any;
    id: string;
    fragment: DocumentNode;
    fragmentName?: string;
    variables?: Object;
}
export interface DataProxy {
    readQuery<QueryType>(options: DataProxyReadQueryOptions): QueryType;
    readFragment<FragmentType>(options: DataProxyReadFragmentOptions): FragmentType | null;
    writeQuery(options: DataProxyWriteQueryOptions): void;
    writeFragment(options: DataProxyWriteFragmentOptions): void;
}
export declare class ReduxDataProxy implements DataProxy {
    private store;
    private reduxRootSelector;
    private reducerConfig;
    private fragmentMatcher;
    constructor(store: ApolloStore, reduxRootSelector: (state: any) => Store, fragmentMatcher: FragmentMatcherInterface, reducerConfig: ApolloReducerConfig);
    readQuery<QueryType>({query, variables}: DataProxyReadQueryOptions): QueryType;
    readFragment<FragmentType>({id, fragment, fragmentName, variables}: DataProxyReadFragmentOptions): FragmentType | null;
    writeQuery({data, query, variables}: DataProxyWriteQueryOptions): void;
    writeFragment({data, id, fragment, fragmentName, variables}: DataProxyWriteFragmentOptions): void;
}
export declare class TransactionDataProxy implements DataProxy {
    private data;
    private reducerConfig;
    private writes;
    private isFinished;
    constructor(data: NormalizedCache, reducerConfig: ApolloReducerConfig);
    finish(): Array<DataWrite>;
    readQuery<QueryType>({query, variables}: DataProxyReadQueryOptions): QueryType;
    readFragment<FragmentType>({id, fragment, fragmentName, variables}: DataProxyReadFragmentOptions): FragmentType | null;
    writeQuery({data, query, variables}: DataProxyWriteQueryOptions): void;
    writeFragment({data, id, fragment, fragmentName, variables}: DataProxyWriteFragmentOptions): void;
    private assertNotFinished();
    private applyWrite(write);
}
