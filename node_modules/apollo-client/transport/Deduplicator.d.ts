import { NetworkInterface, Request } from '../transport/networkInterface';
export declare class Deduplicator {
    private inFlightRequestPromises;
    private networkInterface;
    constructor(networkInterface: NetworkInterface);
    query(request: Request, deduplicate?: boolean): Promise<any>;
    private getKey(request);
}
