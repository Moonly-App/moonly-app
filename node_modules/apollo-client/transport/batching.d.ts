import { Request } from './networkInterface';
import { ExecutionResult } from 'graphql';
export interface QueryFetchRequest {
    request: Request;
    promise?: Promise<ExecutionResult>;
    resolve?: (result: ExecutionResult) => void;
    reject?: (error: Error) => void;
}
export declare class QueryBatcher {
    queuedRequests: QueryFetchRequest[];
    private batchInterval;
    private batchMax;
    private batchFetchFunction;
    constructor({batchInterval, batchMax, batchFetchFunction}: {
        batchInterval: number;
        batchMax?: number;
        batchFetchFunction: (request: Request[]) => Promise<ExecutionResult[]>;
    });
    enqueueRequest(request: Request): Promise<ExecutionResult>;
    consumeQueue(): (Promise<ExecutionResult> | undefined)[] | undefined;
    private scheduleQueueConsumption();
}
