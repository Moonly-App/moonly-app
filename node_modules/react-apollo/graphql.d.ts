import { DocumentNode } from 'graphql';
import { ChildProps, OperationOption, ComponentDecorator } from './types';
export default function graphql<TResult = {}, TProps = {}, TChildProps = ChildProps<TProps, TResult>>(document: DocumentNode, operationOptions?: OperationOption<TProps, TResult>): ComponentDecorator<TProps, TChildProps>;
