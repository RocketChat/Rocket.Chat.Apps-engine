import { IRocketletStorageItem } from './IRocketletStorageItem';

export abstract class RocketletStorage {
    constructor(private readonly engine: string) {}

    public abstract create(item: IRocketletStorageItem): Promise<IRocketletStorageItem>;
    public abstract retrieveOne(id: string): Promise<IRocketletStorageItem>;
    public abstract retrieveAll(): Promise<Array<IRocketletStorageItem>>;
    public abstract update(item: IRocketletStorageItem): Promise<IRocketletStorageItem>;
    public abstract remove(id: string): Promise<{ success: boolean }>;
}
