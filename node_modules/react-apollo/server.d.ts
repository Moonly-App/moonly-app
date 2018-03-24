/// <reference types="react" />
import { ReactElement } from 'react';
import ApolloClient, { ApolloQueryResult } from 'apollo-client';
export interface Context {
    client?: ApolloClient;
    store?: any;
    [key: string]: any;
}
export interface QueryTreeArgument {
    rootElement: ReactElement<any>;
    rootContext?: Context;
}
export interface QueryResult {
    query: Promise<ApolloQueryResult<any>>;
    element: ReactElement<any>;
    context: Context;
}
export declare function walkTree(element: ReactElement<any>, context: Context, visitor: (element: ReactElement<any>, instance: any, context: Context) => boolean | void): void;
export declare function getDataFromTree(rootElement: ReactElement<any>, rootContext?: any, fetchRoot?: boolean): Promise<void>;
export declare function renderToStringWithData(component: ReactElement<any>): Promise<string>;
export declare function cleanupApolloState(apolloState: any): void;
