import { IRocketletStorageItem } from '../storage/IRocketletStorageItem';

import { ISettingRead } from 'temporary-rocketlets-ts-definition/accessors';
import { ISetting } from 'temporary-rocketlets-ts-definition/settings';

export class SettingRead implements ISettingRead {
    constructor(private readonly storageItem: IRocketletStorageItem) {}

    public getById(id: string): ISetting {
        return this.storageItem.settings[id];
    }

    public getValueById(id: string): any {
        const set = this.getById(id);

        if (typeof set === 'undefined') {
            throw new Error(`Setting "${id}" does not exist.`);
        }

        return set.value || set.packageValue;
    }
}
