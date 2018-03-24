import { GraphQLRequest, RequestHandler } from './types';
import { ApolloLink } from './link';
import Observable from 'zen-observable-ts';
export declare function validateLink(link: ApolloLink): ApolloLink;
export declare function validateOperation(operation: GraphQLRequest): GraphQLRequest;
export declare class LinkError extends Error {
    link: ApolloLink;
    constructor(message?: string, link?: ApolloLink);
}
export declare function toLink(link: ApolloLink | RequestHandler): ApolloLink;
export declare function isTerminating(link: ApolloLink): boolean;
export declare function makePromise<R>(observable: Observable<R>): Promise<R>;
