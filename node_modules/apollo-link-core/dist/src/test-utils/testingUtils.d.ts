/// <reference types="sinon" />
import * as sinon from 'sinon';
import * as Links from '../link';
export declare function checkCalls<T>(calls: Array<sinon.SinonSpyCall>, results: Array<T>): void;
export interface TestResultType {
    link: Links.ApolloLink;
    results?: any[];
    query?: string;
    done?: () => void;
    context?: any;
    variables?: any;
}
export declare function testLinkResults(params: TestResultType): void;
