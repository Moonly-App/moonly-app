import { ModifiableWatchQueryOptions, WatchQueryOptions, FetchMoreQueryOptions, SubscribeToMoreOptions } from './watchQueryOptions';
import { Observable } from '../util/Observable';
import { QueryScheduler } from '../scheduler/scheduler';
import { ApolloError } from '../errors/ApolloError';
import { ApolloQueryResult } from './types';
import { NetworkStatus } from '../queries/networkStatus';
export declare type ApolloCurrentResult<T> = {
    data: T | {};
    loading: boolean;
    networkStatus: NetworkStatus;
    error?: ApolloError;
    partial?: boolean;
};
export interface FetchMoreOptions {
    updateQuery: (previousQueryResult: Object, options: {
        fetchMoreResult: Object;
        queryVariables: Object;
    }) => Object;
}
export interface UpdateQueryOptions {
    variables?: Object;
}
export declare class ObservableQuery<T> extends Observable<ApolloQueryResult<T>> {
    options: WatchQueryOptions;
    queryId: string;
    variables: {
        [key: string]: any;
    };
    private isCurrentlyPolling;
    private shouldSubscribe;
    private scheduler;
    private queryManager;
    private observers;
    private subscriptionHandles;
    private lastResult;
    private lastError;
    constructor({scheduler, options, shouldSubscribe}: {
        scheduler: QueryScheduler;
        options: WatchQueryOptions;
        shouldSubscribe?: boolean;
    });
    result(): Promise<ApolloQueryResult<T>>;
    currentResult(): ApolloCurrentResult<T>;
    getLastResult(): ApolloQueryResult<T>;
    refetch(variables?: any): Promise<ApolloQueryResult<T>>;
    fetchMore(fetchMoreOptions: FetchMoreQueryOptions & FetchMoreOptions): Promise<ApolloQueryResult<T>>;
    subscribeToMore(options: SubscribeToMoreOptions): () => void;
    setOptions(opts: ModifiableWatchQueryOptions): Promise<ApolloQueryResult<T>>;
    setVariables(variables: any, tryFetch?: boolean, fetchResults?: boolean): Promise<ApolloQueryResult<T>>;
    updateQuery(mapFn: (previousQueryResult: any, options: UpdateQueryOptions) => any): void;
    stopPolling(): void;
    startPolling(pollInterval: number): void;
    private onSubscribe(observer);
    private setUpQuery();
    private tearDownQuery();
}
