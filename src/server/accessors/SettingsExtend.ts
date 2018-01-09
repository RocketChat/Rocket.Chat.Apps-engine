import { ProxiedApp } from '../ProxiedApp';

import { ISettingsExtend } from '@rocket.chat/apps-ts-definition/accessors';
import { ISetting } from '@rocket.chat/apps-ts-definition/settings';

export class SettingsExtend implements ISettingsExtend {
    constructor(private readonly app: ProxiedApp) { }

    public provideSetting(setting: ISetting): void {
        if (this.app.getStorageItem().settings[setting.id]) {
            const old = this.app.getStorageItem().settings[setting.id];

            setting.createdAt = old.createdAt;
            setting.updatedAt = new Date();
            setting.value = old.value;

            this.app.getStorageItem().settings[setting.id] = setting;

            return;
        }

        setting.createdAt = new Date();
        setting.updatedAt = new Date();
        this.app.getStorageItem().settings[setting.id] = setting;
    }
}
