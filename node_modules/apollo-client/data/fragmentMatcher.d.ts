import { IdValue } from './storeUtils';
import { ReadStoreContext } from './readFromStore';
export interface FragmentMatcherInterface {
    match(idValue: IdValue, typeCondition: string, context: ReadStoreContext): boolean;
}
export declare type IntrospectionResultData = {
    __schema: {
        types: [{
            kind: string;
            name: string;
            possibleTypes: {
                name: string;
            }[];
        }];
    };
};
export declare class IntrospectionFragmentMatcher implements FragmentMatcherInterface {
    private isReady;
    private readyPromise;
    private possibleTypesMap;
    constructor(options?: {
        introspectionQueryResultData?: IntrospectionResultData;
    });
    match(idValue: IdValue, typeCondition: string, context: ReadStoreContext): boolean;
    private parseIntrospectionResult(introspectionResultData);
}
export declare class HeuristicFragmentMatcher implements FragmentMatcherInterface {
    constructor();
    ensureReady(): Promise<void>;
    canBypassInit(): boolean;
    match(idValue: IdValue, typeCondition: string, context: ReadStoreContext): boolean;
}
