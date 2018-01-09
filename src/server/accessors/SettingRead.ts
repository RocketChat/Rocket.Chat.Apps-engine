import { ProxiedApp } from '../ProxiedApp';

import { ISettingRead } from '@rocket.chat/apps-ts-definition/accessors';
import { ISetting } from '@rocket.chat/apps-ts-definition/settings';

export class SettingRead implements ISettingRead {
    constructor(private readonly app: ProxiedApp) {}

    public getById(id: string): ISetting {
        return this.app.getStorageItem().settings[id];
    }

    public getValueById(id: string): any {
        const set = this.getById(id);

        if (typeof set === 'undefined') {
            throw new Error(`Setting "${id}" does not exist.`);
        }

        return set.value || set.packageValue;
    }
}
