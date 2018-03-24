import { DocumentNode } from 'graphql';
import { ApolloReducer, ApolloReducerConfig } from '../store';
import { OperationResultReducer } from './mutationResults';
export declare function createStoreReducer(resultReducer: OperationResultReducer, document: DocumentNode, variables: Object, config: ApolloReducerConfig): ApolloReducer;
