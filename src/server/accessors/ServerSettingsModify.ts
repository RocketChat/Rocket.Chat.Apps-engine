import { IServerSettingBridge } from '../bridges/IServerSettingBridge';

import { IServerSettingsModify } from '@rocket.chat/apps-ts-definition/accessors';
import { ISetting } from '@rocket.chat/apps-ts-definition/settings';

export class ServerSettingsModify implements IServerSettingsModify {
    constructor(private readonly bridge: IServerSettingBridge, private readonly appId: string) { }

    public hideGroup(name: string): void {
        this.bridge.hideGroup(name, this.appId);
    }

    public hideSetting(id: string): void {
        this.bridge.hideSetting(id, this.appId);
    }

    public modifySetting(setting: ISetting): void {
        this.bridge.updateOne(setting, this.appId);
    }
}
