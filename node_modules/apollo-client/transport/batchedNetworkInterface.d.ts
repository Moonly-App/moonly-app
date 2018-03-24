import { ExecutionResult } from 'graphql';
import 'whatwg-fetch';
import { BaseNetworkInterface, HTTPNetworkInterface, Request } from './networkInterface';
import { BatchAfterwareInterface } from './afterware';
import { BatchMiddlewareInterface } from './middleware';
export interface BatchRequestAndOptions {
    requests: Request[];
    options: RequestInit;
}
export interface BatchResponseAndOptions {
    responses: Response[];
    options: RequestInit;
}
export declare class HTTPBatchedNetworkInterface extends BaseNetworkInterface {
    _middlewares: BatchMiddlewareInterface[];
    _afterwares: BatchAfterwareInterface[];
    private batcher;
    constructor({uri, batchInterval, batchMax, fetchOpts}: {
        uri: string;
        batchInterval?: number;
        batchMax?: number;
        fetchOpts: RequestInit;
    });
    query(request: Request): Promise<ExecutionResult>;
    batchQuery(requests: Request[]): Promise<ExecutionResult[]>;
    applyBatchMiddlewares({requests, options}: BatchRequestAndOptions): Promise<BatchRequestAndOptions>;
    applyBatchAfterwares({responses, options}: BatchResponseAndOptions): Promise<BatchResponseAndOptions>;
    use(middlewares: BatchMiddlewareInterface[]): HTTPNetworkInterface;
    useAfter(afterwares: BatchAfterwareInterface[]): HTTPNetworkInterface;
    private batchedFetchFromRemoteEndpoint(batchRequestAndOptions);
}
export interface BatchingNetworkInterfaceOptions {
    uri: string;
    batchInterval?: number;
    batchMax?: number;
    opts?: RequestInit;
}
export declare function createBatchingNetworkInterface(options: BatchingNetworkInterfaceOptions): HTTPNetworkInterface;
