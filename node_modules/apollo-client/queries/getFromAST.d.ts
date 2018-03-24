import { DocumentNode, OperationDefinitionNode, FragmentDefinitionNode } from 'graphql';
export declare function getMutationDefinition(doc: DocumentNode): OperationDefinitionNode;
export declare function checkDocument(doc: DocumentNode): void;
export declare function getOperationName(doc: DocumentNode): string | null;
export declare function getFragmentDefinitions(doc: DocumentNode): FragmentDefinitionNode[];
export declare function getQueryDefinition(doc: DocumentNode): OperationDefinitionNode;
export declare function getOperationDefinition(doc: DocumentNode): OperationDefinitionNode;
export declare function getFragmentDefinition(doc: DocumentNode): FragmentDefinitionNode;
export interface FragmentMap {
    [fragmentName: string]: FragmentDefinitionNode;
}
export declare function createFragmentMap(fragments?: FragmentDefinitionNode[]): FragmentMap;
export declare function getFragmentQueryDocument(document: DocumentNode, fragmentName?: string): DocumentNode;
export declare function getDefaultValues(definition: OperationDefinitionNode): {
    [key: string]: any;
};
