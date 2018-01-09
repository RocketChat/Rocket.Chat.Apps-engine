import { IAppStorageItem } from './IAppStorageItem';

export abstract class AppStorage {
    constructor(private readonly engine: string) { }

    public getEngine() {
        return this.engine;
    }

    public abstract async create(item: IAppStorageItem): Promise<IAppStorageItem>;
    public abstract async retrieveOne(id: string): Promise<IAppStorageItem>;
    public abstract async retrieveAll(): Promise<Map<string, IAppStorageItem>>;
    public abstract async update(item: IAppStorageItem): Promise<IAppStorageItem>;
    public abstract async remove(id: string): Promise<{ success: boolean }>;
}
