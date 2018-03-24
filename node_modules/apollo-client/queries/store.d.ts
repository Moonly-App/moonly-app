import { DocumentNode, GraphQLError, ExecutionResult } from 'graphql';
import { NetworkStatus } from './networkStatus';
export declare type QueryStoreValue = {
    queryString: string;
    document: DocumentNode;
    variables: Object;
    previousVariables?: Object | null;
    networkStatus: NetworkStatus;
    networkError?: Error | null;
    graphQLErrors?: GraphQLError[];
    metadata: any;
};
export declare class QueryStore {
    private store;
    getStore(): {
        [queryId: string]: QueryStoreValue;
    };
    get(queryId: string): QueryStoreValue;
    initQuery(query: {
        queryId: string;
        queryString: string;
        document: DocumentNode;
        storePreviousVariables: boolean;
        variables: Object;
        isPoll: boolean;
        isRefetch: boolean;
        metadata: any;
        fetchMoreForQueryId: string | undefined;
    }): void;
    markQueryResult(queryId: string, result: ExecutionResult, fetchMoreForQueryId: string | undefined): void;
    markQueryError(queryId: string, error: Error, fetchMoreForQueryId: string | undefined): void;
    markQueryResultClient(queryId: string, complete: boolean): void;
    stopQuery(queryId: string): void;
    reset(observableQueryIds: string[]): void;
}
