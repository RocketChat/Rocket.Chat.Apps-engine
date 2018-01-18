import { ILoggerStorageEntry } from '../logging';
import { AppConsole } from '../logging/AppConsole';

export interface IAppLogStorageFindOptions {
    sort?: { [field: string]: number };
    skip?: number;
    limit?: number;
    fields?: { [field: string]: number };
}

export abstract class AppLogStorage {
    constructor(private readonly engine: string) { }

    public getEngine() {
        return this.engine;
    }

    public abstract async find(query: { [field: string]: any },
                               options?: IAppLogStorageFindOptions): Promise<Array<ILoggerStorageEntry>>;

    public abstract async storeEntries(appId: string, logger: AppConsole): Promise<ILoggerStorageEntry>;
    public abstract async getEntriesFor(appId: string): Promise<Array<ILoggerStorageEntry>>;
}
