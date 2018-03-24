import 'whatwg-fetch';
import { ExecutionResult, DocumentNode } from 'graphql';
import { MiddlewareInterface, BatchMiddlewareInterface } from './middleware';
import { AfterwareInterface, BatchAfterwareInterface } from './afterware';
import { Observable } from '../util/Observable';
export interface Request {
    debugName?: string;
    query?: DocumentNode;
    variables?: Object;
    operationName?: string | null;
    [additionalKey: string]: any;
}
export interface PrintedRequest {
    debugName?: string;
    query?: string;
    variables?: Object;
    operationName?: string | null;
}
export interface NetworkInterface {
    [others: string]: any;
    query(request: Request): Promise<ExecutionResult>;
}
export interface ObservableNetworkInterface {
    request(request: Request): Observable<ExecutionResult>;
}
export interface BatchedNetworkInterface extends NetworkInterface {
    batchQuery(requests: Request[]): Promise<ExecutionResult[]>;
}
export interface SubscriptionNetworkInterface extends NetworkInterface {
    subscribe(request: Request, handler: (error: any, result: any) => void): number;
    unsubscribe(id: Number): void;
}
export interface HTTPNetworkInterface extends NetworkInterface {
    _uri: string;
    _opts: RequestInit;
    _middlewares: MiddlewareInterface[] | BatchMiddlewareInterface[];
    _afterwares: AfterwareInterface[] | BatchAfterwareInterface[];
    use(middlewares: MiddlewareInterface[] | BatchMiddlewareInterface[]): HTTPNetworkInterface;
    useAfter(afterwares: AfterwareInterface[] | BatchAfterwareInterface[]): HTTPNetworkInterface;
}
export interface RequestAndOptions {
    request: Request;
    options: RequestInit;
}
export interface ResponseAndOptions {
    response: Response;
    options: RequestInit;
}
export declare function printRequest(request: Request): PrintedRequest;
export declare class BaseNetworkInterface implements NetworkInterface {
    _middlewares: MiddlewareInterface[] | BatchMiddlewareInterface[];
    _afterwares: AfterwareInterface[] | BatchAfterwareInterface[];
    _uri: string;
    _opts: RequestInit;
    constructor(uri: string | undefined, opts?: RequestInit);
    query(request: Request): Promise<ExecutionResult>;
}
export declare class HTTPFetchNetworkInterface extends BaseNetworkInterface {
    _middlewares: MiddlewareInterface[];
    _afterwares: AfterwareInterface[];
    applyMiddlewares(requestAndOptions: RequestAndOptions): Promise<RequestAndOptions>;
    applyAfterwares({response, options}: ResponseAndOptions): Promise<ResponseAndOptions>;
    fetchFromRemoteEndpoint({request, options}: RequestAndOptions): Promise<Response>;
    query(request: Request): Promise<ExecutionResult>;
    use(middlewares: MiddlewareInterface[]): HTTPNetworkInterface;
    useAfter(afterwares: AfterwareInterface[]): HTTPNetworkInterface;
}
export interface NetworkInterfaceOptions {
    uri?: string;
    opts?: RequestInit;
}
export declare function createNetworkInterface(uriOrInterfaceOpts: string | NetworkInterfaceOptions, secondArgOpts?: NetworkInterfaceOptions): HTTPNetworkInterface;
