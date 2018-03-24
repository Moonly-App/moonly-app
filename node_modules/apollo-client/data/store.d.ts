import { ApolloAction } from '../actions';
import { ApolloReducerConfig } from '../store';
import { NormalizedCache } from './storeUtils';
export declare function data(previousState: NormalizedCache | undefined, action: ApolloAction, config: ApolloReducerConfig): NormalizedCache;
