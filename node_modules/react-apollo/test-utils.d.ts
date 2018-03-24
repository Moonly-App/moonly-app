/// <reference types="react" />
import * as React from 'react';
import { NetworkInterface, Request, SubscriptionNetworkInterface } from 'apollo-client';
import { ExecutionResult, DocumentNode } from 'graphql';
export declare class MockedProvider extends React.Component<any, any> {
    private client;
    constructor(props: any, context: any);
    render(): JSX.Element;
}
export declare class MockedSubscriptionProvider extends React.Component<any, any> {
    private client;
    constructor(props: any, context: any);
    render(): JSX.Element;
}
export declare function mockNetworkInterface(...mockedResponses: MockedResponse[]): NetworkInterface;
export declare function mockSubscriptionNetworkInterface(mockedSubscriptions: MockedSubscription[], ...mockedResponses: MockedResponse[]): MockSubscriptionNetworkInterface;
export interface ParsedRequest {
    variables?: Object;
    query?: DocumentNode;
    debugName?: string;
}
export interface MockedResponse {
    request: ParsedRequest;
    result?: ExecutionResult;
    error?: Error;
    delay?: number;
    newData?: () => any;
}
export interface MockedSubscriptionResult {
    result?: ExecutionResult;
    error?: Error;
    delay?: number;
}
export interface MockedSubscription {
    request: ParsedRequest;
    results?: MockedSubscriptionResult[];
    id?: number;
}
export declare class MockNetworkInterface implements NetworkInterface {
    private mockedResponsesByKey;
    constructor(...mockedResponses: MockedResponse[]);
    addMockedResponse(mockedResponse: MockedResponse): void;
    query(request: Request): Promise<{}>;
}
export declare class MockSubscriptionNetworkInterface extends MockNetworkInterface implements SubscriptionNetworkInterface {
    mockedSubscriptionsByKey: {
        [key: string]: MockedSubscription[];
    };
    mockedSubscriptionsById: {
        [id: number]: MockedSubscription;
    };
    handlersById: {
        [id: number]: (error: any, result: any) => void;
    };
    subId: number;
    constructor(mockedSubscriptions: MockedSubscription[], ...mockedResponses: MockedResponse[]);
    generateSubscriptionId(): number;
    addMockedSubscription(mockedSubscription: MockedSubscription): void;
    subscribe(request: Request, handler: (error: any, result: any) => void): number;
    fireResult(id: number): void;
    unsubscribe(id: number): void;
}
