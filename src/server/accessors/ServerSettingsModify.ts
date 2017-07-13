import { IServerSettingBridge } from '../bridges/IServerSettingBridge';

import { IServerSettingsModify } from 'temporary-rocketlets-ts-definition/accessors';
import { ISetting } from 'temporary-rocketlets-ts-definition/settings';

export class ServerSettingsModify implements IServerSettingsModify {
    constructor(private readonly bridge: IServerSettingBridge, private readonly rocketletId: string) { }

    public hideGroup(name: string): void {
        this.bridge.hideGroup(name, this.rocketletId);
    }

    public hideSetting(id: string): void {
        this.bridge.hideSetting(id, this.rocketletId);
    }

    public modifySetting(setting: ISetting): void {
        this.bridge.updateOne(setting, this.rocketletId);
    }
}
