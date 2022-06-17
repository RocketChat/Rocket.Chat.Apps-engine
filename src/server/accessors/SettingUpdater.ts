import { ISettingUpdater } from '../../definition/accessors/ISettingUpdater';
import { ISetting } from '../../definition/settings';
import { ProxiedApp } from '../ProxiedApp';

export class SettingUpdater implements ISettingUpdater {
    constructor(private readonly app: ProxiedApp) { }

    public async updateValue(id: ISetting['id'], value: ISetting['value']) {
        if (!this.app.getStorageItem().settings[id]) {
            return;
        }

        const setting = await Promise.resolve(this.app.getStorageItem().settings[id]);

        setting.updatedAt = new Date();
        setting.value = value;

        this.app.getStorageItem().settings[setting.id] = setting;
    }
}
