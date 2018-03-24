export declare type CleanupFunction = () => void;
export declare type SubscriberFunction<T> = (observer: Observer<T>) => Subscription | CleanupFunction;
export declare class Observable<T> {
    private subscriberFunction;
    constructor(subscriberFunction: SubscriberFunction<T>);
    subscribe(observer: Observer<T>): Subscription;
}
export interface Observer<T> {
    next?: (value: T) => void;
    error?: (error: Error) => void;
    complete?: () => void;
}
export interface Subscription {
    unsubscribe: CleanupFunction;
}
