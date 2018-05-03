import * as Datastore from 'nedb';

import { AppConsole, ILoggerStorageEntry } from '../../src/server/logging';
import { AppLogStorage, IAppLogStorageFindOptions } from '../../src/server/storage';

export class TestsAppLogStorage extends AppLogStorage {
    private db: Datastore;

    constructor() {
        super('nedb');
        this.db = new Datastore({ filename: 'tests/test-data/dbs/logs.nedb', autoload: true });
    }

    public find(query: { [field: string]: any },
                options?: IAppLogStorageFindOptions): Promise<Array<ILoggerStorageEntry>> {
        return new Promise((resolve, reject) => {
            this.db.find(query, (err: Error, items: Array<ILoggerStorageEntry>) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(items);
                }
            });
        });
    }

    public storeEntries(appId: string, logger: AppConsole): Promise<ILoggerStorageEntry> {
        return new Promise((resolve, reject) => {
            const item = AppConsole.toStorageEntry(appId, logger);

            this.db.insert(item, (err2: Error, doc2: ILoggerStorageEntry) => {
                if (err2) {
                    reject(err2);
                } else {
                    resolve(doc2);
                }
            });
        });
    }

    public getEntriesFor(appId: string): Promise<Array<ILoggerStorageEntry>> {
        return new Promise((resolve, reject) => {
            this.db.find({ appId }, (err: Error, items: Array<ILoggerStorageEntry>) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(items);
                }
            });
        });
    }
}
