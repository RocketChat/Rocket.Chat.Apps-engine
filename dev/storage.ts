import { IRocketletStorageItem, RocketletStorage } from '../dist/storage';

export class TestingStorage extends RocketletStorage {
    public create(item: IRocketletStorageItem): IRocketletStorageItem {
        throw new Error('Method not implemented.');
    }

    public retrieveOne(id: string): IRocketletStorageItem {
        throw new Error('Method not implemented.');
    }

    public retrieveAll(): Array<IRocketletStorageItem> {
        throw new Error('Method not implemented.');
    }

    public update(item: IRocketletStorageItem): IRocketletStorageItem {
        throw new Error('Method not implemented.');
    }

    public remove(id: string): IRocketletStorageItem {
        throw new Error('Method not implemented.');
    }
}
