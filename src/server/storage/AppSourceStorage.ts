import { IAppStorageItem } from './IAppStorageItem';

export abstract class AppSourceStorage {
    public abstract store(item: IAppStorageItem, zip: Buffer): Promise<boolean>;
    public abstract fetch(item: IAppStorageItem): Promise<Buffer>;
    public abstract update(id: string, zip: Buffer): Promise<boolean>;
    public abstract remove(item: IAppStorageItem): Promise<boolean>;
}
