import Observable from 'zen-observable-ts';
import { ExecutionResult, DocumentNode } from 'graphql';
export interface GraphQLRequest {
    query?: string | DocumentNode;
    variables?: Record<string, any>;
    context?: Record<string, any>;
}
export interface Operation {
    query: DocumentNode;
    variables?: Record<string, any>;
    operationName?: string;
    context?: Record<string, any>;
}
export declare type FetchResult<C = Record<string, any>, E = Record<string, any>> = ExecutionResult & {
    extensions?: E;
    context?: C;
};
export declare type NextLink = (operation: Operation) => Observable<FetchResult>;
export declare type RequestHandler = (operation: Operation, forward?: NextLink) => Observable<FetchResult> | null;
