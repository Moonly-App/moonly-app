import { DocumentNode } from 'graphql';
import { QueryStoreValue } from '../queries/store';
import { NetworkStatus } from '../queries/networkStatus';
export declare type QueryListener = (queryStoreValue: QueryStoreValue) => void;
export declare type PureQueryOptions = {
    query: DocumentNode;
    variables?: {
        [key: string]: any;
    };
};
export declare type ApolloQueryResult<T> = {
    data: T;
    loading: boolean;
    networkStatus: NetworkStatus;
    stale: boolean;
};
export declare type ApolloExecutionResult<T = {
    [key: string]: any;
}> = {
    data?: T;
};
export declare enum FetchType {
    normal = 1,
    refetch = 2,
    poll = 3,
}
export declare type IdGetter = (value: Object) => string | null | undefined;
