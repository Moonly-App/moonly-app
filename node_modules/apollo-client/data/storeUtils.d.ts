import { FieldNode, InlineFragmentNode, ValueNode, SelectionNode, ExecutionResult, NameNode } from 'graphql';
export declare function valueToObjectRepresentation(argObj: any, name: NameNode, value: ValueNode, variables?: Object): void;
export declare function storeKeyNameFromField(field: FieldNode, variables?: Object): string;
export declare type Directives = {
    [directiveName: string]: {
        [argName: string]: any;
    };
};
export declare function getStoreKeyName(fieldName: string, args?: Object, directives?: Directives): string;
export declare function resultKeyNameFromField(field: FieldNode): string;
export declare function isField(selection: SelectionNode): selection is FieldNode;
export declare function isInlineFragment(selection: SelectionNode): selection is InlineFragmentNode;
export declare function graphQLResultHasError(result: ExecutionResult): number | undefined;
export interface NormalizedCache {
    [dataId: string]: StoreObject;
}
export interface StoreObject {
    __typename?: string;
    [storeFieldKey: string]: StoreValue;
}
export interface IdValue {
    type: 'id';
    id: string;
    generated: boolean;
}
export interface JsonValue {
    type: 'json';
    json: any;
}
export declare type ListValue = Array<null | IdValue>;
export declare type StoreValue = number | string | string[] | IdValue | ListValue | JsonValue | null | undefined | void | Object;
export declare function isIdValue(idObject: StoreValue): idObject is IdValue;
export declare function toIdValue(id: string, generated?: boolean): IdValue;
export declare function isJsonValue(jsonObject: StoreValue): jsonObject is JsonValue;
