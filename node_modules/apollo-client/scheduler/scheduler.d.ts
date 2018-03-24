import { QueryManager } from '../core/QueryManager';
import { FetchType, QueryListener } from '../core/types';
import { ObservableQuery } from '../core/ObservableQuery';
import { WatchQueryOptions } from '../core/watchQueryOptions';
export declare class QueryScheduler {
    inFlightQueries: {
        [queryId: string]: WatchQueryOptions;
    };
    registeredQueries: {
        [queryId: string]: WatchQueryOptions;
    };
    intervalQueries: {
        [interval: number]: string[];
    };
    queryManager: QueryManager;
    private pollingTimers;
    constructor({queryManager}: {
        queryManager: QueryManager;
    });
    checkInFlight(queryId: string): boolean;
    fetchQuery<T>(queryId: string, options: WatchQueryOptions, fetchType: FetchType): Promise<{}>;
    startPollingQuery<T>(options: WatchQueryOptions, queryId: string, listener?: QueryListener): string;
    stopPollingQuery(queryId: string): void;
    fetchQueriesOnInterval<T>(interval: number): void;
    addQueryOnInterval<T>(queryId: string, queryOptions: WatchQueryOptions): void;
    registerPollingQuery<T>(queryOptions: WatchQueryOptions): ObservableQuery<T>;
}
