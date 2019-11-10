import { AppStorage, IAppStorageItem } from '../../../src/server/storage';

const mockEngine: string = 'testing-engine';

class MockSubAppStorage extends AppStorage {
    public async create(item: IAppStorageItem): Promise<IAppStorageItem> {
        return Promise.resolve({} as IAppStorageItem);
    }
    public async retrieveOne(id: string): Promise<IAppStorageItem> {
        return Promise.resolve({} as IAppStorageItem);
    }
    public async retrieveAll(): Promise<Map<string, IAppStorageItem>> {
        return Promise.resolve(new Map());
    }
    public async update(item: IAppStorageItem): Promise<IAppStorageItem> {
        return Promise.resolve({} as IAppStorageItem);
    }
    public async remove(id: string): Promise<{ success: boolean }> {
        return { success: true };
    }
}

test('basicAppStorage', () => {
    let mockSubAppStorage: MockSubAppStorage;

    expect(() => mockSubAppStorage = new MockSubAppStorage(mockEngine)).not.toThrow();
    expect(mockSubAppStorage.getEngine()).toBe(mockEngine);
});
