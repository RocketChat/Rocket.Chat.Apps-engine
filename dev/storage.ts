import * as Datastore from 'nedb';
import { IRocketletStorageItem, RocketletStorage } from '../src/storage';

export class TestingStorage extends RocketletStorage {
    private db: Datastore;

    constructor() {
        super('nedb');
        this.db = new Datastore({ filename: 'data/rocketlets.nedb', autoload: true });
        this.db.ensureIndex({ fieldName: 'id', unique: true });
    }

    public create(item: IRocketletStorageItem): Promise<IRocketletStorageItem> {
        return new Promise((resolve, reject) => {
            item.createdAt = new Date();
            item.updatedAt = new Date();

            // tslint:disable-next-line
            this.db.findOne({ $or: [{ id: item.id }, { 'info.nameSlug': item.info.nameSlug }] }, (err: Error, doc: IRocketletStorageItem) => {
                if (err) {
                    reject(err);
                } else if (doc) {
                    reject(new Error('Rocketlet already exists.'));
                } else {
                    this.db.insert(item, (err2: Error, doc2: IRocketletStorageItem) => {
                        if (err2) {
                            reject(err2);
                        } else {
                            resolve(doc2);
                        }
                    });
                }
            });
        });
    }

    public retrieveOne(id: string): Promise<IRocketletStorageItem> {
        return new Promise((resolve, reject) => {
            this.db.findOne({ id }, (err: Error, doc: IRocketletStorageItem) => {
                if (err) {
                    reject(err);
                } else if (doc) {
                    resolve(doc);
                } else {
                    reject(new Error(`Nothing found by the id: ${id}`));
                }
            });
        });
    }

    public retrieveAll(): Promise<Array<IRocketletStorageItem>> {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: Error, docs: Array<IRocketletStorageItem>) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    public update(item: IRocketletStorageItem): Promise<IRocketletStorageItem> {
        return new Promise((resolve, reject) => {
            this.db.update({ id: item.id }, { $set: item }, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    return this.retrieveOne(item.id);
                }
            });
        });
    }

    public remove(id: string): Promise<{ success: boolean}> {
        return new Promise((resolve, reject) => {
            this.db.remove({ id }, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ success: true });
                }
            });
        });
    }
}
