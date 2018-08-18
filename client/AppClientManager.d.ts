import { AppServerCommunicator } from './AppServerCommunicator';
export declare class AppClientManager {
    private readonly communicator;
    private apps;
    constructor(communicator: AppServerCommunicator);
    load(): Promise<void>;
}
