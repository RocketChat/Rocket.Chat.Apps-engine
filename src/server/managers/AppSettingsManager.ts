import { AppMethod } from '../../definition/metadata';
import { ISetting } from '../../definition/settings';
import { AppManager } from '../AppManager';
import { Utilities } from '../misc/Utilities';

export class AppSettingsManager {
    constructor(private manager: AppManager) { }

    public getAppSettings(appId: string): { [key: string]: ISetting } {
        const rl = this.manager.getOneById(appId);

        if (!rl) {
            throw new Error('No App found by the provided id.');
        }

        return Utilities.deepCloneAndFreeze(rl.getStorageItem().settings);
    }

    public getAppSetting(appId: string, settingId: string): ISetting {
        const settings = this.getAppSettings(appId);

        if (!settings[settingId]) {
            throw new Error('No setting found for the App by the provided id.');
        }

        return Utilities.deepCloneAndFreeze(settings[settingId]);
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

        this.manager.getBridges().getAppDetailChangesBridge().doOnAppSettingsChange(appId, setting);

        const configModify = this.manager.getAccessorManager().getConfigurationModify(rl.getID());
        const reader = this.manager.getAccessorManager().getReader(rl.getID());
        const http = this.manager.getAccessorManager().getHttp(rl.getID());

        rl.call(AppMethod.ONSETTINGUPDATED, setting, configModify, reader, http);
    }
}
