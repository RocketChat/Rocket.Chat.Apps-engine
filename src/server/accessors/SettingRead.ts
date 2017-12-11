import { ProxiedRocketlet } from '../ProxiedRocketlet';

import { ISettingRead } from 'temporary-rocketlets-ts-definition/accessors';
import { ISetting } from 'temporary-rocketlets-ts-definition/settings';

export class SettingRead implements ISettingRead {
    constructor(private readonly rocketlet: ProxiedRocketlet) {}

    public getById(id: string): ISetting {
        return this.rocketlet.getStorageItem().settings[id];
    }

    public getValueById(id: string): any {
        const set = this.getById(id);

        if (typeof set === 'undefined') {
            throw new Error(`Setting "${id}" does not exist.`);
        }

        return set.value || set.packageValue;
    }
}
