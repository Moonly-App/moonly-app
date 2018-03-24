import { GraphQLRequest, NextLink, Operation, RequestHandler, FetchResult } from './types';
import Observable from 'zen-observable-ts';
export declare abstract class ApolloLink {
    static from(links: (ApolloLink | RequestHandler)[]): ApolloLink;
    static empty(): ApolloLink;
    static passthrough(): ApolloLink;
    static split(test: (op: Operation) => boolean, left: ApolloLink | RequestHandler, right?: ApolloLink | RequestHandler): ApolloLink;
    split(test: (op: Operation) => boolean, left: ApolloLink | RequestHandler, right?: ApolloLink | RequestHandler): ApolloLink;
    concat(next: ApolloLink | RequestHandler): ApolloLink;
    abstract request(operation: Operation, forward?: NextLink): Observable<FetchResult> | null;
}
export declare function execute(link: ApolloLink, operation: GraphQLRequest): Observable<FetchResult>;
export declare class FunctionLink extends ApolloLink {
    f: RequestHandler;
    constructor(f: RequestHandler);
    request(operation: Operation, forward: NextLink): Observable<FetchResult>;
}
