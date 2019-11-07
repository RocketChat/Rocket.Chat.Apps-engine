import { AppMethod } from '../../../src/definition/metadata';
import { TestData } from '../../test-data/utilities';

import { AppManager } from '../../../src/server/AppManager';
import { AppBridges } from '../../../src/server/bridges';
import { AppAccessorManager, AppApiManager, AppSettingsManager, AppSlashCommandManager } from '../../../src/server/managers';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { AppStorage, IAppStorageItem } from '../../../src/server/storage';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';

let mockStorageItem: IAppStorageItem;
let mockApp: ProxiedApp;
let mockBridges: AppBridges;
let mockAccessors: AppAccessorManager;
let mockStorage: AppStorage;
let mockManager: AppManager;

beforeAll(() =>  {
    mockStorageItem = {
        settings: {},
    } as IAppStorageItem;

    mockStorageItem.settings.testing = TestData.getSetting('testing');

    const si = mockStorageItem;
    mockApp = {
        getID() {
            return 'testing';
        },
        getStorageItem() {
            return si;
        },
        setStorageItem(item: IAppStorageItem) {
            return;
        },
        call(method: AppMethod, ...args: Array<any>): Promise<any> {
            return Promise.resolve();
        },
    } as ProxiedApp;

    mockBridges = new TestsAppBridges();

    mockStorage = {
        update(item: IAppStorageItem): Promise<IAppStorageItem> {
            return Promise.resolve(item);
        },
    } as AppStorage;

    const st = mockStorage;
    const bri = mockBridges;
    const app = mockApp;
    mockManager = {
        getOneById(appId: string): ProxiedApp {
            return appId === 'testing' ? app : undefined;
        },
        getBridges(): AppBridges {
            return bri;
        },
        getStorage(): AppStorage {
            return st;
        },
        getCommandManager(): AppSlashCommandManager {
            return {} as AppSlashCommandManager;
        },
        getApiManager(): AppApiManager {
            return {} as AppApiManager;
        },
    } as AppManager;

    mockAccessors = new AppAccessorManager(mockManager);
    const ac = mockAccessors;
    mockManager.getAccessorManager = function _getAccessorManager(): AppAccessorManager {
        return ac;
    };
});

test('basicAppSettingsManager', () => {
    expect(() => new AppSettingsManager(mockManager)).not.toThrow();

    const asm = new AppSettingsManager(mockManager);
    expect(asm.getAppSettings('testing')).not.toBe(mockStorageItem.settings);
    expect(asm.getAppSettings('testing')).toEqual(mockStorageItem.settings);
    expect(() => asm.getAppSettings('fake')).toThrowError('No App found by the provided id.');
    expect(() => asm.getAppSettings('testing').testing.value = 'testing').toThrow();

    expect(asm.getAppSetting('testing', 'testing')).not.toBe(mockStorageItem.settings.testing);
    expect(asm.getAppSetting('testing', 'testing')).toEqual(mockStorageItem.settings.testing);
    expect(() => asm.getAppSetting('fake', 'testing')).toThrowError('No App found by the provided id.');
    expect(() => asm.getAppSetting('testing', 'fake')).toThrowError('No setting found for the App by the provided id.');
    expect(() => asm.getAppSetting('testing', 'testing').value = 'testing').toThrow();
});

test('updatingSettingViaAppSettingsManager', async () => {
    const asm = new AppSettingsManager(mockManager);

    jest.spyOn(mockStorage, 'update');
    jest.spyOn(mockApp, 'call');
    jest.spyOn(mockApp, 'setStorageItem');
    jest.spyOn(mockBridges.getAppDetailChangesBridge(), 'onAppSettingsChange');
    jest.spyOn(mockAccessors, 'getConfigurationModify');
    jest.spyOn(mockAccessors, 'getReader');
    jest.spyOn(mockAccessors, 'getHttp');

    await expect(asm.updateAppSetting('fake', TestData.getSetting())).rejects.toThrowError( 'No App found by the provided id.');
    await expect(asm.updateAppSetting('testing', TestData.getSetting('fake'))).rejects.toThrowError( 'No setting found for the App by the provided id.');

    const set = TestData.getSetting('testing');
    await asm.updateAppSetting('testing', set);

    expect(mockStorage.update).toHaveBeenCalledWith(mockStorageItem);
    expect(mockStorage.update).toHaveBeenCalledTimes(1);

    expect(mockApp.setStorageItem).toHaveBeenCalledWith(mockStorageItem);
    expect(mockApp.setStorageItem).toHaveBeenCalledTimes(1);

    expect(mockBridges.getAppDetailChangesBridge().onAppSettingsChange).toHaveBeenCalledWith('testing', set);
    expect(mockBridges.getAppDetailChangesBridge().onAppSettingsChange).toHaveBeenCalledTimes(1);

    expect(mockAccessors.getConfigurationModify).toHaveBeenCalledWith('testing');
    expect(mockAccessors.getConfigurationModify).toHaveBeenCalledTimes(1);

    expect(mockAccessors.getReader).toHaveBeenCalledWith('testing');
    expect(mockAccessors.getReader).toHaveBeenCalledTimes(1);

    expect(mockAccessors.getHttp).toHaveBeenCalledWith('testing');
    expect(mockAccessors.getHttp).toHaveBeenCalledTimes(1);

    expect(mockApp.call).toHaveBeenCalledWith(AppMethod.ONSETTINGUPDATED, set,
        mockAccessors.getConfigurationModify('testing'),
        mockAccessors.getReader('testing'),
        mockAccessors.getHttp('testing'),
    );
    expect(mockApp.call).toHaveBeenCalledTimes(1);
});
