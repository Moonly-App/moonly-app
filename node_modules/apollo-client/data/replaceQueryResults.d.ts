import { NormalizedCache } from './storeUtils';
import { ApolloReducerConfig } from '../store';
import { DocumentNode } from 'graphql';
export declare function replaceQueryResults(state: NormalizedCache, {variables, document, newResult}: {
    variables: any;
    document: DocumentNode;
    newResult: Object;
}, config: ApolloReducerConfig): NormalizedCache;
