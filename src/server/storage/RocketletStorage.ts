import { IRocketletStorageItem } from './IRocketletStorageItem';

export abstract class RocketletStorage {
    constructor(private readonly engine: string) {}

    public abstract async create(item: IRocketletStorageItem): Promise<IRocketletStorageItem>;
    public abstract async retrieveOne(id: string): Promise<IRocketletStorageItem>;
    public abstract async retrieveAll(): Promise<Map<string, IRocketletStorageItem>>;
    public abstract async update(item: IRocketletStorageItem): Promise<IRocketletStorageItem>;
    public abstract async remove(id: string): Promise<{ success: boolean }>;
}
