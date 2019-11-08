import { ISetting, SettingType } from '../../../src/definition/settings';

import { SettingsExtend } from '../../../src/server/accessors';
import { ProxiedApp } from '../../../src/server/ProxiedApp';
import { IAppStorageItem } from '../../../src/server/storage';

test('basicSettingsExtend', () => {
    expect(() => new SettingsExtend({} as ProxiedApp)).not.toThrow();
});

test('provideSettingToSettingsExtend', async (): Promise<void> => {
    const mockedStorageItem: IAppStorageItem = {
        settings: {},
    } as IAppStorageItem;

    const mockedApp: ProxiedApp = {
        getStorageItem: function _getStorageItem() {
            return mockedStorageItem;
        },
    } as ProxiedApp;
    const se = new SettingsExtend(mockedApp);

    const setting: ISetting = {
        id: 'testing',
        type: SettingType.STRING,
        packageValue: 'thing',
        required: false,
        public: false,
        i18nLabel: 'Testing_Settings',
    };

    await expect(() => se.provideSetting(setting)).not.toThrowError();
    expect(mockedStorageItem.settings).not.toBeEmpty();

    const settingModified: ISetting = {
        id: 'testing',
        type: SettingType.STRING,
        packageValue: 'thing',
        required: false,
        public: false,
        i18nLabel: 'Testing_Thing',
        value: 'dont-use-me',
    };
    await expect(() => se.provideSetting(settingModified)).not.toThrowError();
    expect(mockedStorageItem.settings.testing).toBeDefined();
    expect(mockedStorageItem.settings.testing.value).not.toBeDefined();
    expect(mockedStorageItem.settings.testing.i18nLabel).toBe('Testing_Thing');
});
