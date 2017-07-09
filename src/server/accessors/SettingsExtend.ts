import { ISettingsExtend } from 'temporary-rocketlets-ts-definition/accessors';
import { ISetting } from 'temporary-rocketlets-ts-definition/settings';
import { IRocketletStorageItem } from '../storage';

export class SettingsExtend implements ISettingsExtend {
    constructor(private readonly storageItem: IRocketletStorageItem) { }

    public provideSetting(setting: ISetting): void {
        if (this.storageItem.settings[setting.id]) {
            const old = this.storageItem.settings[setting.id];

            setting.createdAt = old.createdAt;
            setting.updatedAt = new Date();
            setting.value = old.value;

            this.storageItem.settings[setting.id] = setting;

            return;
        }

        setting.createdAt = new Date();
        setting.updatedAt = new Date();
        this.storageItem.settings[setting.id] = setting;
    }
}
