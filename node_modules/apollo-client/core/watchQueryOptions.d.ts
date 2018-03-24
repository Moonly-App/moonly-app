import { DocumentNode } from 'graphql';
import { OperationResultReducer, MutationQueryReducersMap } from '../data/mutationResults';
import { DataProxy } from '../data/proxy';
import { PureQueryOptions, ApolloExecutionResult } from './types';
export declare type FetchPolicy = 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'standby';
export interface ModifiableWatchQueryOptions {
    variables?: {
        [key: string]: any;
    };
    pollInterval?: number;
    fetchPolicy?: FetchPolicy;
    fetchResults?: boolean;
    notifyOnNetworkStatusChange?: boolean;
    reducer?: OperationResultReducer;
}
export interface WatchQueryOptions extends ModifiableWatchQueryOptions {
    query: DocumentNode;
    metadata?: any;
}
export interface FetchMoreQueryOptions {
    query?: DocumentNode;
    variables?: {
        [key: string]: any;
    };
}
export declare type SubscribeToMoreOptions = {
    document: DocumentNode;
    variables?: {
        [key: string]: any;
    };
    updateQuery?: (previousQueryResult: Object, options: {
        subscriptionData: {
            data: any;
        };
        variables: {
            [key: string]: any;
        };
    }) => Object;
    onError?: (error: Error) => void;
};
export interface SubscriptionOptions {
    query: DocumentNode;
    variables?: {
        [key: string]: any;
    };
}
export interface MutationOptions<T = {
    [key: string]: any;
}> {
    mutation: DocumentNode;
    variables?: Object;
    optimisticResponse?: Object | Function;
    updateQueries?: MutationQueryReducersMap<T>;
    refetchQueries?: string[] | PureQueryOptions[];
    update?: MutationUpdaterFn<T>;
}
export declare type MutationUpdaterFn<T = {
    [key: string]: any;
}> = (proxy: DataProxy, mutationResult: ApolloExecutionResult<T>) => void;
