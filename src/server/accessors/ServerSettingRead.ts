import { IServerSettingBridge } from '../bridges/IServerSettingBridge';

import { IServerSettingRead } from 'temporary-rocketlets-ts-definition/accessors';
import { ISetting } from 'temporary-rocketlets-ts-definition/settings';

export class ServerSettingRead implements IServerSettingRead {
    constructor(private readonly settingBridge: IServerSettingBridge, private readonly rocketletId: string) { }

    public getOneById(id: string): ISetting {
        return this.settingBridge.getOneById(id, this.rocketletId);
    }

    public getValueById(id: string): any {
        const set = this.settingBridge.getOneById(id, this.rocketletId);

        if (typeof set === 'undefined') {
            throw new Error(`No Server Setting, or it is unaccessible, by the id of "${id}".`);
        }

        return set.value || set.packageValue;
    }

    public getAll(): Array<ISetting> {
        return this.settingBridge.getAll(this.rocketletId);
    }

    public isReadableById(id: string): boolean {
        return this.settingBridge.isReadableById(id, this.rocketletId);
    }
}
