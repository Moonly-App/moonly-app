import { DocumentNode } from 'graphql';
import { FragmentMatcher } from 'graphql-anywhere';
import { NormalizedCache, IdValue } from './storeUtils';
import { ApolloReducerConfig } from '../store';
export declare const ID_KEY: string | symbol;
export declare type DiffResult = {
    result?: any;
    isMissing?: boolean;
};
export declare type ReadQueryOptions = {
    store: NormalizedCache;
    query: DocumentNode;
    fragmentMatcherFunction?: FragmentMatcher;
    variables?: Object;
    previousResult?: any;
    rootId?: string;
    config?: ApolloReducerConfig;
};
export declare type DiffQueryAgainstStoreOptions = ReadQueryOptions & {
    returnPartialData?: boolean;
};
export declare type CustomResolver = (rootValue: any, args: {
    [argName: string]: any;
}) => any;
export declare type CustomResolverMap = {
    [typeName: string]: {
        [fieldName: string]: CustomResolver;
    };
};
export declare function readQueryFromStore<QueryType>(options: ReadQueryOptions): QueryType;
export declare type ReadStoreContext = {
    store: NormalizedCache;
    returnPartialData: boolean;
    hasMissingField: boolean;
    customResolvers: CustomResolverMap;
};
export declare function diffQueryAgainstStore({store, query, variables, previousResult, returnPartialData, rootId, fragmentMatcherFunction, config}: DiffQueryAgainstStoreOptions): DiffResult;
export declare function assertIdValue(idValue: IdValue): void;
