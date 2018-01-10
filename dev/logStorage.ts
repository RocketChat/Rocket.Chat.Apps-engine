import * as Datastore from 'nedb';

import { AppConsole, ILoggerStorageEntry } from '../src/server/logging';
import { AppLogStorage } from '../src/server/storage/index';

export class DevAppLogStorage extends AppLogStorage {
    private db: Datastore;

    constructor() {
        super('nedb');
        this.db = new Datastore({ filename: 'data/logs.nedb', autoload: true });
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
}
