import { IRocketletStorageItem } from './IRocketletStorageItem';

export abstract class RocketletStorage {
    public abstract create(item: IRocketletStorageItem): IRocketletStorageItem;
    public abstract retrieveOne(id: string): IRocketletStorageItem;
    public abstract retrieveAll(): Array<IRocketletStorageItem>;
    public abstract update(item: IRocketletStorageItem): IRocketletStorageItem;
    public abstract remove(id: string): IRocketletStorageItem;
}
