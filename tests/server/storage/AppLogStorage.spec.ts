import { ILoggerStorageEntry } from '../../../src/server/logging';
import { AppLogStorage, IAppLogStorageFindOptions } from '../../../src/server/storage';

const mockEngine: string = 'testing-engine';

class MockSubAppLogStorage extends AppLogStorage {
    public async find(
        query: { [field: string]: any }, options?: IAppLogStorageFindOptions,
    ): Promise<Array<ILoggerStorageEntry>> {
        return Promise.resolve([]);
    }
    public async storeEntries(appId: string, logger: AppConsole): Promise<ILoggerStorageEntry> {
        return Promise.resolve({} as ILoggerStorageEntry);
    }
    public async getEntriesFor(appId: string): Promise<Array<ILoggerStorageEntry>> {
        return Promise.resolve([]);
    }
    public async removeEntriesFor(appId: string): Promise<void> {
        return;
    }
}

test('basicAppLogStorage', () => {
    let mockSubAppLogStorage: MockSubAppLogStorage;

    expect(() => mockSubAppLogStorage = new MockSubAppLogStorage(mockEngine)).not.toThrow();
    expect(mockSubAppLogStorage.getEngine()).toBe(mockEngine);
});
