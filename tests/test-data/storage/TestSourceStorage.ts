import { AppSourceStorage, IAppStorageItem } from '../../../src/server/storage';

export class TestSourceStorage extends AppSourceStorage {
    public async store(item: IAppStorageItem, zip: Buffer): Promise<boolean> {
        return true;
    }
    public async fetch(item: IAppStorageItem): Promise<Buffer> {
        return Buffer.from('buffer');
    }
    public async update(id: string, zip: Buffer): Promise<boolean> {
        return true;
    }
    public async remove(item: IAppStorageItem): Promise<boolean> {
        return true;
    }

}
