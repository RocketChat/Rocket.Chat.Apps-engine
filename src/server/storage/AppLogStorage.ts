import { ILoggerStorageEntry } from '../logging';
import { AppConsole } from '../logging/AppConsole';

export abstract class AppLogStorage {
    constructor(private readonly engine: string) { }

    public getEngine() {
        return this.engine;
    }

    public abstract async storeEntries(appId: string, logger: AppConsole): Promise<ILoggerStorageEntry>;
}
