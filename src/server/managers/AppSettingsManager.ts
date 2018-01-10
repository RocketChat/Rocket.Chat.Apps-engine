import { AppMethod } from '@rocket.chat/apps-ts-definition/metadata';
import { ISetting } from '@rocket.chat/apps-ts-definition/settings';
import { AppManager } from '../AppManager';

export class AppSettingsManager {
    constructor(private manager: AppManager) { }

    public getAppSettings(appId: string): { [key: string]: ISetting } {
        const rl = this.manager.getOneById(appId);

        if (!rl) {
            throw new Error('No App found by the provided id.');
        }

        return Object.assign({}, rl.getStorageItem().settings);
    }

    public getAppSetting(appId: string, settingId: string): ISetting {
        const settings = this.getAppSettings(appId);

        if (!settings[settingId]) {
            throw new Error('No setting found for the App by the provided id.');
        }

        return Object.assign({}, settings[settingId]);
    }

    public async updateAppSetting(appId: string, setting: ISetting): Promise<void> {
        const rl = this.manager.getOneById(appId);

        if (!rl) {
            throw new Error('No App found by the provided id.');
        }

        if (!rl.getStorageItem().settings[setting.id]) {
            throw new Error('No setting found for the App by the provided id.');
        }

        setting.updatedAt = new Date();
        rl.getStorageItem().settings[setting.id] = setting;

        const item = await this.manager.getStorage().update(rl.getStorageItem());

        rl.setStorageItem(item);

        const configModify = this.manager.getAccessorManager().getConfigurationModify(rl.getID());
        const reader = this.manager.getAccessorManager().getReader(rl.getID());
        const http = this.manager.getAccessorManager().getHttp(rl.getID());

        rl.call(AppMethod.ONSETTINGUPDATED, setting, configModify, reader, http);
    }
}
