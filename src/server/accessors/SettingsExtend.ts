import { ProxiedRocketlet } from '../ProxiedRocketlet';

import { ISettingsExtend } from 'temporary-rocketlets-ts-definition/accessors';
import { ISetting } from 'temporary-rocketlets-ts-definition/settings';

export class SettingsExtend implements ISettingsExtend {
    constructor(private readonly rocketlet: ProxiedRocketlet) { }

    public provideSetting(setting: ISetting): void {
        if (this.rocketlet.getStorageItem().settings[setting.id]) {
            const old = this.rocketlet.getStorageItem().settings[setting.id];

            setting.createdAt = old.createdAt;
            setting.updatedAt = new Date();
            setting.value = old.value;

            this.rocketlet.getStorageItem().settings[setting.id] = setting;

            return;
        }

        setting.createdAt = new Date();
        setting.updatedAt = new Date();
        this.rocketlet.getStorageItem().settings[setting.id] = setting;
    }
}
