import { IServerSettingBridge } from '../bridges/IServerSettingBridge';

import { IServerSettingRead } from '@rocket.chat/apps-ts-definition/accessors';
import { ISetting } from '@rocket.chat/apps-ts-definition/settings';

export class ServerSettingRead implements IServerSettingRead {
    constructor(private readonly settingBridge: IServerSettingBridge, private readonly appId: string) { }

    public getOneById(id: string): ISetting {
        return this.settingBridge.getOneById(id, this.appId);
    }

    public getValueById(id: string): any {
        const set = this.settingBridge.getOneById(id, this.appId);

        if (typeof set === 'undefined') {
            throw new Error(`No Server Setting found, or it is unaccessible, by the id of "${id}".`);
        }

        return set.value || set.packageValue;
    }

    public getAll(): Array<ISetting> {
        return this.settingBridge.getAll(this.appId);
    }

    public isReadableById(id: string): boolean {
        return this.settingBridge.isReadableById(id, this.appId);
    }
}
