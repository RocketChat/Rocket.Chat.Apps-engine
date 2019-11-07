import { TestData } from '../../test-data/utilities';

import { SettingRead } from '../../../src/server/accessors';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { IAppStorageItem } from '../../../src/server/storage';

let mockStorageItem: IAppStorageItem;
let mockProxiedApp: ProxiedApp;

beforeAll(() =>  {
    mockStorageItem = {
        settings: { },
    } as IAppStorageItem;
    mockStorageItem.settings.testing = TestData.getSetting('testing');

    const si = mockStorageItem;
    mockProxiedApp = {
        getStorageItem(): IAppStorageItem {
            return si;
        },
    } as ProxiedApp;
});

test('appSettingRead', async () => {
    expect(() => new SettingRead({} as ProxiedApp)).not.toThrow();

    const sr = new SettingRead(mockProxiedApp);
    expect(await sr.getById('testing')).toBeDefined();
    expect(await sr.getById('testing')).toEqual(TestData.getSetting('testing'));
    expect(await sr.getValueById('testing')).toBe('The packageValue');
    mockStorageItem.settings.testing.value = 'my value';
    expect(await sr.getValueById('testing')).toBe('my value');
    await expect(sr.getValueById('superfake')).rejects.toThrowError( 'Setting "superfake" does not exist.');
});
