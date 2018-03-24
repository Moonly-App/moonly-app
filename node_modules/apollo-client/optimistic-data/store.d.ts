import { NormalizedCache } from '../data/storeUtils';
import { Store } from '../store';
export declare type OptimisticStoreItem = {
    mutationId: string;
    data: NormalizedCache;
};
export declare type OptimisticStore = OptimisticStoreItem[];
export declare function getDataWithOptimisticResults(store: Store): NormalizedCache;
export declare function optimistic(previousState: any[] | undefined, action: any, store: any, config: any): OptimisticStore;
