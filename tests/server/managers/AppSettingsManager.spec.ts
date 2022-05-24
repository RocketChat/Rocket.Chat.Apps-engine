// tslint:disable:max-line-length

import { AsyncTest, Expect, SetupFixture, SpyOn, Test } from 'alsatian';
import { AppMethod } from '../../../src/definition/metadata';
import { TestData } from '../../test-data/utilities';

import { AppManager } from '../../../src/server/AppManager';
import { AppBridges } from '../../../src/server/bridges';
import { AppAccessorManager, AppApiManager, AppExternalComponentManager, AppSchedulerManager, AppSettingsManager, AppSlashCommandManager, AppVideoConfProviderManager } from '../../../src/server/managers';
import { UIActionButtonManager } from '../../../src/server/managers/UIActionButtonManager';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { AppMetadataStorage, IAppStorageItem } from '../../../src/server/storage';
import { TestsAppBridges } from '../../test-data/bridges/appBridges';

export class AppSettingsManagerTestFixture {
    private mockStorageItem: IAppStorageItem;
    private mockApp: ProxiedApp;
    private mockBridges: AppBridges;
    private mockAccessors: AppAccessorManager;
    private mockStorage: AppMetadataStorage;
    private mockManager: AppManager;

    @SetupFixture
    public setupFixture() {
        this.mockStorageItem = {
            settings: {},
        } as IAppStorageItem;

        this.mockStorageItem.settings.testing = TestData.getSetting('testing');

        const si = this.mockStorageItem;
        this.mockApp = {
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

        this.mockBridges = new TestsAppBridges();

        this.mockStorage = {
            update(item: IAppStorageItem): Promise<IAppStorageItem> {
                return Promise.resolve(item);
            },
        } as AppMetadataStorage;

        const st = this.mockStorage;
        const bri = this.mockBridges;
        const app = this.mockApp;
        this.mockManager = {
            getOneById(appId: string): ProxiedApp {
                return appId === 'testing' ? app : undefined;
            },
            getBridges(): AppBridges {
                return bri;
            },
            getStorage(): AppMetadataStorage {
                return st;
            },
            getCommandManager(): AppSlashCommandManager {
                return {} as AppSlashCommandManager;
            },
            getExternalComponentManager(): AppExternalComponentManager {
                return {} as AppExternalComponentManager;
            },
            getApiManager(): AppApiManager {
                return {} as AppApiManager;
            },
            getSchedulerManager() {
                return {} as AppSchedulerManager;
            },
            getUIActionButtonManager() {
                return {} as UIActionButtonManager;
            },
            getVideoConfProviderManager() {
                return {} as AppVideoConfProviderManager;
            },
        } as AppManager;

        this.mockAccessors = new AppAccessorManager(this.mockManager);
        const ac = this.mockAccessors;
        this.mockManager.getAccessorManager = function _getAccessorManager(): AppAccessorManager {
            return ac;
        };
    }

    @Test()
    public basicAppSettingsManager() {
        Expect(() => new AppSettingsManager(this.mockManager)).not.toThrow();

        const asm = new AppSettingsManager(this.mockManager);
        Expect(asm.getAppSettings('testing')).not.toBe(this.mockStorageItem.settings);
        Expect(asm.getAppSettings('testing')).toEqual(this.mockStorageItem.settings);
        Expect(() => asm.getAppSettings('fake')).toThrowError(Error, 'No App found by the provided id.');
        Expect(() => asm.getAppSettings('testing').testing.value = 'testing').toThrow();

        Expect(asm.getAppSetting('testing', 'testing')).not.toBe(this.mockStorageItem.settings.testing);
        Expect(asm.getAppSetting('testing', 'testing')).toEqual(this.mockStorageItem.settings.testing);
        Expect(() => asm.getAppSetting('fake', 'testing')).toThrowError(Error, 'No App found by the provided id.');
        Expect(() => asm.getAppSetting('testing', 'fake')).toThrowError(Error, 'No setting found for the App by the provided id.');
        Expect(() => asm.getAppSetting('testing', 'testing').value = 'testing').toThrow();
    }

    @AsyncTest()
    public async updatingSettingViaAppSettingsManager() {
        const asm = new AppSettingsManager(this.mockManager);

        SpyOn(this.mockStorage, 'update');
        SpyOn(this.mockApp, 'call');
        SpyOn(this.mockApp, 'setStorageItem');
        SpyOn(this.mockBridges.getAppDetailChangesBridge(), 'doOnAppSettingsChange');
        SpyOn(this.mockAccessors, 'getConfigurationModify');
        SpyOn(this.mockAccessors, 'getReader');
        SpyOn(this.mockAccessors, 'getHttp');

        await Expect(async () => await asm.updateAppSetting('fake', TestData.getSetting())).toThrowErrorAsync(Error, 'No App found by the provided id.');
        await Expect(async () => await asm.updateAppSetting('testing', TestData.getSetting('fake'))).toThrowErrorAsync(Error, 'No setting found for the App by the provided id.');

        const set = TestData.getSetting('testing');
        await Expect(async () => await asm.updateAppSetting('testing', set)).not.toThrowAsync();

        Expect(this.mockStorage.update).toHaveBeenCalledWith(this.mockStorageItem).exactly(1);
        Expect(this.mockApp.setStorageItem).toHaveBeenCalledWith(this.mockStorageItem).exactly(1);
        Expect(this.mockBridges.getAppDetailChangesBridge().doOnAppSettingsChange).toHaveBeenCalledWith('testing', set).exactly(1);

        // Accessors
        Expect(this.mockAccessors.getConfigurationModify).toHaveBeenCalledWith('testing').exactly(1);
        Expect(this.mockAccessors.getReader).toHaveBeenCalledWith('testing').exactly(1);
        Expect(this.mockAccessors.getHttp).toHaveBeenCalledWith('testing').exactly(1);

        Expect(this.mockApp.call).toHaveBeenCalledWith(AppMethod.ONSETTINGUPDATED, set,
            this.mockAccessors.getConfigurationModify('testing'),
            this.mockAccessors.getReader('testing'),
            this.mockAccessors.getHttp('testing'),
        ).exactly(1);
    }
}
