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

    public abstract find(
        query: { [field: string]: any },
        options?: IAppLogStorageFindOptions,
    ): Promise<Array<ILoggerStorageEntry>>;

    public abstract storeEntries(appId: string, logger: AppConsole): Promise<ILoggerStorageEntry>;
    public abstract getEntriesFor(appId: string): Promise<Array<ILoggerStorageEntry>>;
    public abstract removeEntriesFor(appId: string): Promise<void>;
}
