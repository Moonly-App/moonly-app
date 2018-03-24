import { Middleware, Action } from 'redux';
import { FragmentMatcher } from 'graphql-anywhere';
import { NormalizedCache } from './data/storeUtils';
import { OptimisticStore, getDataWithOptimisticResults } from './optimistic-data/store';
export { getDataWithOptimisticResults };
import { ApolloAction } from './actions';
import { IdGetter } from './core/types';
import { CustomResolverMap } from './data/readFromStore';
export interface ReducerError {
    error: Error;
    queryId?: string;
    mutationId?: string;
    subscriptionId?: number;
}
export interface Store {
    data: NormalizedCache;
    optimistic: OptimisticStore;
    reducerError: ReducerError | null;
}
export interface ApolloStore {
    dispatch: (action: ApolloAction) => void;
    getState: () => any;
}
export declare type ApolloReducer = (store: NormalizedCache, action: ApolloAction) => NormalizedCache;
export declare function createApolloReducer(config: ApolloReducerConfig): (state: Store, action: ApolloAction | Action) => Store;
export declare function createApolloStore({reduxRootKey, initialState, config, reportCrashes, logger}?: {
    reduxRootKey?: string;
    initialState?: any;
    config?: ApolloReducerConfig;
    reportCrashes?: boolean;
    logger?: Middleware;
}): ApolloStore;
export declare type ApolloReducerConfig = {
    dataIdFromObject?: IdGetter;
    customResolvers?: CustomResolverMap;
    fragmentMatcher?: FragmentMatcher;
    addTypename?: boolean;
};
